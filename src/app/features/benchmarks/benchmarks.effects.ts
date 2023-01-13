import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { filter, map, mergeMap, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  BENCHMARKS_GET_MEMPOOL_TRANSACTIONS,
  BENCHMARKS_GET_MEMPOOL_TRANSACTIONS_SUCCESS,
  BENCHMARKS_GET_WALLETS,
  BENCHMARKS_GET_WALLETS_SUCCESS,
  BENCHMARKS_SEND_TX,
  BENCHMARKS_SEND_TX_SUCCESS,
  BENCHMARKS_SEND_TXS,
  BenchmarksActions,
  BenchmarksSendTx,
  BenchmarksSendTxSuccess,
} from '@benchmarks/benchmarks.actions';
import { BenchmarksService } from '@benchmarks/benchmarks.service';
import { BenchmarksWallet } from '@shared/types/benchmarks/benchmarks-wallet.type';
import { BenchmarksMempoolTx } from '@shared/types/benchmarks/benchmarks-mempool-tx.type';
import { BenchmarksTransaction } from '@shared/types/benchmarks/benchmarks-transaction.type';

@Injectable({
  providedIn: 'root',
})
export class BenchmarksEffects extends MinaBaseEffect<BenchmarksActions> {

  readonly getWallets$: Effect;
  readonly sendTxs$: Effect;
  readonly sendTx$: Effect;
  readonly sendTxSuccess$: Effect;
  readonly getMempoolTxs$: Effect;

  constructor(private router: Router,
              private actions$: Actions,
              private benchmarksService: BenchmarksService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getWallets$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_GET_WALLETS),
      switchMap(() => this.benchmarksService.getAccounts()),
      map((payload: BenchmarksWallet[]) => ({ type: BENCHMARKS_GET_WALLETS_SUCCESS, payload })),
    ));

    this.sendTxs$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_SEND_TXS),
      this.latestActionState<BenchmarksSendTxSuccess>(),
      switchMap(({ state }) => state.benchmarks.txsToSend.map(tx => ({ type: BENCHMARKS_SEND_TX, payload: tx }))),
    ));

    this.sendTx$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_SEND_TX),
      this.latestActionState<BenchmarksSendTx>(),
      mergeMap(({ action }) => this.benchmarksService.sendOneTx(action.payload)),
      map((payload: BenchmarksTransaction | { error: Error }) => ({ type: BENCHMARKS_SEND_TX_SUCCESS, payload })),
    ));

    this.sendTxSuccess$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_SEND_TX_SUCCESS),
      this.latestActionState<BenchmarksSendTxSuccess>(),
      filter(({ state }) => state.benchmarks.txsToSend.length === 0),
      map(() => ({ type: BENCHMARKS_GET_MEMPOOL_TRANSACTIONS })),
    ));

    this.getMempoolTxs$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_GET_MEMPOOL_TRANSACTIONS, BENCHMARKS_GET_WALLETS_SUCCESS),
      switchMap(() => this.benchmarksService.getMempoolTransactions()),
      map((payload: BenchmarksMempoolTx[]) => ({ type: BENCHMARKS_GET_MEMPOOL_TRANSACTIONS_SUCCESS, payload })),
    ));
  }
}
