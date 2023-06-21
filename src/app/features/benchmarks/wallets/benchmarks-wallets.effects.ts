import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { concatMap, filter, map, mergeMap, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS,
  BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS_SUCCESS,
  BENCHMARKS_WALLETS_GET_WALLETS,
  BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS,
  BENCHMARKS_WALLETS_SEND_TX,
  BENCHMARKS_WALLETS_SEND_TX_SUCCESS,
  BENCHMARKS_WALLETS_SEND_TX_SYNCED,
  BENCHMARKS_WALLETS_SEND_TXS,
  BenchmarksWalletsActions,
  BenchmarksWalletsSendTx,
  BenchmarksWalletsSendTxSuccess,
  BenchmarksWalletsSendTxSynced,
} from '@benchmarks/wallets/benchmarks-wallets.actions';
import { BenchmarksWalletsService } from '@benchmarks/wallets/benchmarks-wallets.service';
import { BenchmarksWallet } from '@shared/types/benchmarks/wallets/benchmarks-wallet.type';
import { BenchmarksMempoolTx } from '@shared/types/benchmarks/wallets/benchmarks-mempool-tx.type';
import { BenchmarksWalletTransaction } from '@shared/types/benchmarks/wallets/benchmarks-wallet-transaction.type';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';

@Injectable({
  providedIn: 'root',
})
export class BenchmarksWalletsEffects extends MinaBaseEffect<BenchmarksWalletsActions> {

  readonly getWallets$: Effect;
  readonly sendTxs$: Effect;
  readonly sendTx$: Effect;
  readonly sendTxSynced$: Effect;
  readonly sendTxSuccess$: Effect;
  readonly getMempoolTxs$: Effect;

  constructor(private router: Router,
              private actions$: Actions,
              private benchmarksService: BenchmarksWalletsService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getWallets$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_WALLETS_GET_WALLETS),
      switchMap(() => this.benchmarksService.getAccounts()),
      map((payload: BenchmarksWallet[]) => ({ type: BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS, []),
    ));

    this.sendTxs$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_WALLETS_SEND_TXS),
      this.latestActionState<BenchmarksWalletsSendTxSuccess>(),
      switchMap(({ state }) =>
        state.benchmarks.wallets.randomWallet
          ? state.benchmarks.wallets.txsToSend.map(tx => ({ type: BENCHMARKS_WALLETS_SEND_TX, payload: tx }))
          : [{ type: BENCHMARKS_WALLETS_SEND_TX_SYNCED, payload: state.benchmarks.wallets.txsToSend }],
      ),
    ));

    this.sendTx$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_WALLETS_SEND_TX),
      this.latestActionState<BenchmarksWalletsSendTx>(),
      mergeMap(({ action }) => this.benchmarksService.sendOneTx(action.payload)),
      map((payload: BenchmarksWalletTransaction | { error: Error }) => ({ type: BENCHMARKS_WALLETS_SEND_TX_SUCCESS, payload })),
    ));

    this.sendTxSynced$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_WALLETS_SEND_TX_SYNCED),
      this.latestActionState<BenchmarksWalletsSendTxSynced>(),
      switchMap(({ action }) => action.payload),
      concatMap((tx: BenchmarksWalletTransaction) => this.benchmarksService.sendOneTx(tx)),
      map((payload) => ({ type: BENCHMARKS_WALLETS_SEND_TX_SUCCESS, payload })),
    ));

    this.sendTxSuccess$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_WALLETS_SEND_TX_SUCCESS),
      this.latestActionState<BenchmarksWalletsSendTxSuccess>(),
      filter(({ state }) => state.benchmarks.wallets.txsToSend.length === 0),
      map(() => ({ type: BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS })),
    ));

    this.getMempoolTxs$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS, BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS),
      switchMap(() => this.benchmarksService.getMempoolTransactions()),
      map((payload: BenchmarksMempoolTx[]) => ({ type: BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS_SUCCESS, []),
    ));
  }
}
