import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { catchError, map, repeat, Subject, switchMap, tap } from 'rxjs';
import { addErrorObservable, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { NetworkSnarksService } from '@network/snarks/network-snarks.service';
import { NetworkSnark } from '@shared/types/network/snarks/network-snark';
import {
  NETWORK_TRANSACTIONS_CLOSE,
  NETWORK_TRANSACTIONS_GET_TRANSACTIONS,
  NETWORK_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS,
  NETWORK_TRANSACTIONS_GO_LIVE,
  NETWORK_TRANSACTIONS_PAUSE,
  NetworkTransactionsActions,
  NetworkTransactionsGetTransactions,
  NetworkTransactionsGoLive,
} from '@network/transactions/network-transactions.actions';

@Injectable({
  providedIn: 'root',
})
export class NetworkTransactionsEffects extends MinaBaseEffect<NetworkTransactionsActions> {

  readonly init$: Effect;
  readonly getTransactions$: Effect;
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

    this.getTransactions$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_TRANSACTIONS_GET_TRANSACTIONS, NETWORK_TRANSACTIONS_GO_LIVE),
      this.latestActionState<NetworkTransactionsGetTransactions | NetworkTransactionsGoLive>(),
      tap(({ state }) => this.streamActive = state.network.snarks.stream),
      tap(() => this.waitingForServer = true),
      switchMap(({ action, state }) => this.networkSnarksService.getSnarks()),
      tap(() => this.waitingForServer = false),
      map((payload: NetworkSnark[]) => ({ type: NETWORK_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.DEBUGGER)),
      repeat(),
    ));

    this.pause$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_TRANSACTIONS_PAUSE),
      tap(() => this.streamActive = false),
    ));

    this.goLive$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_TRANSACTIONS_GO_LIVE),
      tap(() => this.streamActive = true),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_TRANSACTIONS_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.networkDestroy$.next(null);
      }),
    ));
  }
}
