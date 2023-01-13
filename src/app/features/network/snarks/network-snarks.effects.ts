import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { catchError, map, repeat, Subject, switchMap, tap } from 'rxjs';
import { addErrorObservable, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  NETWORK_SNARKS_CLOSE,
  NETWORK_SNARKS_GET_SNARKS,
  NETWORK_SNARKS_GET_SNARKS_SUCCESS,
  NETWORK_SNARKS_GO_LIVE,
  NETWORK_SNARKS_PAUSE,
  NetworkSnarksActions,
  NetworkSnarksGetSnarks,
  NetworkSnarksGoLive,
} from '@network/snarks/network-snarks.actions';
import { NetworkSnarksService } from '@network/snarks/network-snarks.service';
import { NetworkSnark } from '@shared/types/network/snarks/network-snark';

@Injectable({
  providedIn: 'root',
})
export class NetworkSnarksEffects extends MinaBaseEffect<NetworkSnarksActions> {

  readonly init$: Effect;
  readonly getSnarks$: Effect;
  readonly pause$: NonDispatchableEffect;
  readonly goLive$: NonDispatchableEffect;
  readonly close$: NonDispatchableEffect;

  private networkDestroy$: Subject<void> = new Subject<void>();
  private streamActive: boolean;
  private waitingForServer: boolean;

  constructor(private actions$: Actions,
              private networkSnarksService: NetworkSnarksService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    // this.init$ = createEffect(() => this.actions$.pipe(
    //   ofType(NETWORK_CONNECTIONS_INIT),
    //   this.latestActionState<NetworkConnectionsInit>(),
    //   tap(({ action, state }) => this.streamActive = state.network.connections.stream),
    //   switchMap(({ action, state }) =>
    //     timer(0, 10000).pipe(
    //       takeUntil(this.networkDestroy$),
    //       filter(() => this.streamActive && !this.waitingForServer),
    //       map(() => ({ type: NETWORK_CONNECTIONS_GET_CONNECTIONS })),
    //     ),
    //   ),
    // ));

    this.getSnarks$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_SNARKS_GET_SNARKS, NETWORK_SNARKS_GO_LIVE),
      this.latestActionState<NetworkSnarksGetSnarks | NetworkSnarksGoLive>(),
      tap(({ state }) => this.streamActive = state.network.snarks.stream),
      tap(() => this.waitingForServer = true),
      switchMap(({ action, state }) => this.networkSnarksService.getSnarks()),
      tap(() => this.waitingForServer = false),
      map((payload: NetworkSnark[]) => ({ type: NETWORK_SNARKS_GET_SNARKS_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.DEBUGGER)),
      repeat(),
    ));

    this.pause$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_SNARKS_PAUSE),
      tap(() => this.streamActive = false),
    ));

    this.goLive$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_SNARKS_GO_LIVE),
      tap(() => this.streamActive = true),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_SNARKS_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.networkDestroy$.next(null);
      }),
    ));
  }
}
