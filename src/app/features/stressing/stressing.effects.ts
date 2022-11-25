import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { catchError, filter, map, mergeMap, repeat, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { addError, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  STRESSING_CHANGE_TRANSACTION_BATCH,
  STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL,
  STRESSING_CLOSE,
  STRESSING_CREATE_TRANSACTION,
  STRESSING_CREATE_TRANSACTION_SUCCESS,
  STRESSING_GET_TRANSACTIONS,
  STRESSING_GET_TRANSACTIONS_STATUSES_SUCCESS,
  STRESSING_GET_TRANSACTIONS_SUCCESS,
  STRESSING_GET_WALLETS,
  STRESSING_GET_WALLETS_SUCCESS,
  STRESSING_SEND_TRANSACTIONS,
  STRESSING_STREAM_SENDING_LIVE,
  STRESSING_STREAM_SENDING_PAUSE,
  StressingActions,
  StressingChangeTransactionSendingInterval,
  StressingCreateTransaction,
  StressingGetTransactions,
  StressingGetTransactionsSuccess,
  StressingGetWallets,
  StressingGetWalletsSuccess,
  StressingSendTransactions,
  StressingStreamSendingLive,
} from '@stressing/stressing.actions';
import { StressingService } from '@stressing/stressing.service';
import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';
import { StressingWallet } from '@shared/types/stressing/stressing-wallet.type';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { HttpErrorResponse } from '@angular/common/http';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';

@Injectable({
  providedIn: 'root',
})
export class StressingEffects extends MinaBaseEffect<StressingActions> {

  readonly init$: Effect;
  readonly init2$: Effect;
  readonly getWallets$: Effect;
  readonly getTransactions$: Effect;
  readonly createTransaction$: Effect;
  readonly sendTransactions$: Effect;
  readonly getTransactionsSuccess$: Effect;
  readonly close$: NonDispatchableEffect;
  readonly pause$: NonDispatchableEffect;

  private destroy$: Subject<void> = new Subject<void>();
  private streamActive: boolean;
  private stressingStreamActive: boolean;

  constructor(private router: Router,
              private actions$: Actions,
              private stressingService: StressingService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_GET_WALLETS_SUCCESS),
      this.latestActionState<StressingGetWalletsSuccess>(),
      tap(() => {
        this.streamActive = true;
      }),
      switchMap(() =>
        timer(0, 10000).pipe(
          takeUntil(this.destroy$),
          filter(() => this.streamActive),
          map(() => ({ type: STRESSING_GET_TRANSACTIONS })),
        ),
      ),
    ));

    this.init2$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_STREAM_SENDING_LIVE, STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL, STRESSING_CHANGE_TRANSACTION_BATCH),
      this.latestActionState<StressingStreamSendingLive | StressingChangeTransactionSendingInterval>(),
      tap(() => this.stressingStreamActive = true),
      switchMap(({ state }) =>
        timer(0, state.stressing.intervalDuration * ONE_THOUSAND).pipe(
          takeUntil(this.destroy$),
          filter(() => this.stressingStreamActive),
          map(() => ({ type: STRESSING_SEND_TRANSACTIONS })),
        ),
      ),
    ));

    this.sendTransactions$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_SEND_TRANSACTIONS),
      this.latestActionState<StressingSendTransactions>(),
      filter(({ state }) => state.stressing.wallets.length > 0),
      switchMap(({ state }) => {
        const wallets: { from: StressingWallet, to: string }[] = [];
        let i = 0;
        state.stressing.wallets.forEach((wallet: StressingWallet) => {
          if (i < state.stressing.trSendingBatch && wallet.minaTokens > 1 && !state.stressing.transactions.filter(t => t.status === 'pending').some(t => t.from === wallet.publicKey)) {

            const getRandomReceiver = (): StressingWallet => {
              const index = Math.floor(Math.random() * state.stressing.wallets.length);
              if (state.stressing.wallets[index].publicKey === wallet.publicKey) {
                return getRandomReceiver();
              }
              return state.stressing.wallets[index];
            };

            wallets.push({
              from: wallet,
              to: getRandomReceiver().publicKey,
            });

            i++;
          }
        });
        console.log('Sending: ', wallets);
        return wallets.map(
          wallet => ({ type: STRESSING_CREATE_TRANSACTION, payload: { from: wallet.from, to: wallet.to } }),
        );
      }),
    ));

    this.createTransaction$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_CREATE_TRANSACTION),
      this.latestActionState<StressingCreateTransaction>(),
      mergeMap(({ action }) => this.stressingService.createTransaction(action.payload.from, action.payload.to)),
      map(() => ({ type: STRESSING_CREATE_TRANSACTION_SUCCESS, payload: { success: 1, fail: 0 } })),
      catchError((error: HttpErrorResponse) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: STRESSING_CREATE_TRANSACTION_SUCCESS, payload: { success: 0, fail: 1 } },
      ]),
      repeat(),
    ));

    this.getWallets$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_GET_WALLETS),
      this.latestActionState<StressingGetWallets>(),
      switchMap(() => this.stressingService.getWallets()),
      map((payload: any[]) => ({ type: STRESSING_GET_WALLETS_SUCCESS, payload })),
    ));

    this.getTransactions$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_GET_TRANSACTIONS),
      this.latestActionState<StressingGetTransactions>(),
      mergeMap(() => this.stressingService.getTransactions()),
      map((payload: StressingTransaction[]) => ({ type: STRESSING_GET_TRANSACTIONS_SUCCESS, payload })),
    ));

    this.getTransactionsSuccess$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_GET_TRANSACTIONS_SUCCESS),
      this.latestActionState<StressingGetTransactionsSuccess>(),
      switchMap(({ state }) => this.stressingService.getTransactionStatuses(state.stressing.transactions.filter(t => t.isInMempool).map(t => t.id))),
      map((payload: { [id: string]: string }) => ({ type: STRESSING_GET_TRANSACTIONS_STATUSES_SUCCESS, payload })),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(STRESSING_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.destroy$.next(null);
      }),
    ));

    this.pause$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(STRESSING_STREAM_SENDING_PAUSE),
      tap(() => this.stressingStreamActive = false),
    ));
  }
}
