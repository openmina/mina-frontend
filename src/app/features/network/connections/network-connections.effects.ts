import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { catchError, filter, map, repeat, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { addErrorObservable, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  NETWORK_CONNECTIONS_CLOSE,
  NETWORK_CONNECTIONS_GET_CONNECTIONS,
  NETWORK_CONNECTIONS_GET_CONNECTIONS_SUCCESS,
  NETWORK_CONNECTIONS_GO_LIVE,
  NETWORK_CONNECTIONS_INIT,
  NETWORK_CONNECTIONS_PAUSE,
  NetworkConnectionsActions,
  NetworkConnectionsGetConnections,
  NetworkConnectionsGoLive,
  NetworkConnectionsInit,
} from '@network/connections/network-connections.actions';
import { NetworkConnectionsService } from '@network/connections/network-connections.service';
import { NetworkConnection } from '@shared/types/network/connections/network-connection.type';

@Injectable({
  providedIn: 'root',
})
export class NetworkConnectionsEffects extends MinaBaseEffect<NetworkConnectionsActions> {

  readonly init$: Effect;
  readonly getConnections$: Effect;
  readonly pause$: NonDispatchableEffect;
  readonly goLive$: NonDispatchableEffect;
  readonly close$: NonDispatchableEffect;

  private networkDestroy$: Subject<void> = new Subject<void>();
  private streamActive: boolean;
  private waitingForServer: boolean;

  constructor(private actions$: Actions,
              private networkConnectionsService: NetworkConnectionsService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_CONNECTIONS_INIT),
      this.latestActionState<NetworkConnectionsInit>(),
      tap(({ action, state }) => this.streamActive = state.network.connections.stream),
      switchMap(({ action, state }) =>
        timer(0, 10000).pipe(
          takeUntil(this.networkDestroy$),
          filter(() => this.streamActive && !this.waitingForServer),
          map(() => ({ type: NETWORK_CONNECTIONS_GET_CONNECTIONS })),
        ),
      ),
    ));

    this.getConnections$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_CONNECTIONS_GET_CONNECTIONS, NETWORK_CONNECTIONS_GO_LIVE),
      this.latestActionState<NetworkConnectionsGetConnections | NetworkConnectionsGoLive>(),
      tap(({ state }) => this.streamActive = state.network.connections.stream),
      tap(() => this.waitingForServer = true),
      switchMap(({ action, state }) =>
        this.networkConnectionsService.getConnections(
          state.network.connections.limit,
          (action as any).payload?.id,
          state.network.connections.direction,
        ),
      ),
      tap(() => this.waitingForServer = false),
      map((payload: NetworkConnection[]) => ({ type: NETWORK_CONNECTIONS_GET_CONNECTIONS_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.DEBUGGER)),
      repeat(),
    ));

    this.pause$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_CONNECTIONS_PAUSE),
      tap(() => this.streamActive = false),
    ));

    this.goLive$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_CONNECTIONS_GO_LIVE),
      tap(() => this.streamActive = true),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_CONNECTIONS_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.networkDestroy$.next(null);
      }),
    ));
  }
}
