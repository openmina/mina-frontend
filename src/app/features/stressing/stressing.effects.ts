import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { filter, map, mergeMap, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { createNonDispatchableEffect } from '@shared/constants/store-functions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  STRESSING_CLOSE,
  STRESSING_GET_TRANSACTIONS,
  STRESSING_GET_TRANSACTIONS_SUCCESS,
  STRESSING_GET_WALLETS,
  STRESSING_GET_WALLETS_SUCCESS,
  STRESSING_INIT,
  STRESSING_SEND_TRANSACTIONS,
  STRESSING_SEND_TRANSACTIONS_SUCCESS,
  StressingActions,
  StressingGetTransactions,
  StressingGetWallets,
  StressingInit,
  StressingSendTransactions,
} from '@stressing/stressing.actions';
import { StressingService } from '@stressing/stressing.service';
import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';
import { StressingWallet } from '@shared/types/stressing/stressing-wallet.type';

@Injectable({
  providedIn: 'root',
})
export class StressingEffects extends MinaBaseEffect<StressingActions> {

  readonly init$: Effect;
  readonly init2$: Effect;
  readonly getWallets$: Effect;
  readonly getTransactions$: Effect;
  readonly sendTransactions$: Effect;
  readonly close$: NonDispatchableEffect;

  private destroy$: Subject<void> = new Subject<void>();
  private streamActive: boolean;

  constructor(private router: Router,
              private actions$: Actions,
              private stressingService: StressingService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_INIT),
      this.latestActionState<StressingInit>(),
      switchMap(() =>
        timer(0, 5000).pipe(
          takeUntil(this.destroy$),
          map(() => ({ type: STRESSING_GET_TRANSACTIONS })),
        ),
      ),
    ));

    this.init2$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_INIT),
      this.latestActionState<StressingInit>(),
      switchMap(({ state }) =>
        timer(2000, state.stressing.intervalDuration).pipe(
          takeUntil(this.destroy$),
          map(() => ({ type: STRESSING_SEND_TRANSACTIONS })),
        ),
      ),
    ));

    this.sendTransactions$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_SEND_TRANSACTIONS),
      this.latestActionState<StressingSendTransactions>(),
      tap(_ => console.log('sending')),
      filter(({ state }) => state.stressing.wallets.length > 0),
      switchMap(({ state }) => {
        const wallets: { from: StressingWallet, to: string }[] = [];
        let i = 0;
        state.stressing.wallets.forEach((wallet: StressingWallet) => {
          if (i < state.stressing.trSendingBatch && wallet.minaTokens > 1 && !state.stressing.transactions.some(t => t.from === wallet.publicKey)) {

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
        return this.stressingService.createBulkTransactions(wallets);
      }),
      map((payload: any[]) => ({ type: STRESSING_SEND_TRANSACTIONS_SUCCESS, payload })),
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

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(STRESSING_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.destroy$.next(null);
      }),
    ));
  }
}
