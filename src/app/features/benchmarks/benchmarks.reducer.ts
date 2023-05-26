import { BenchmarksState } from '@benchmarks/benchmarks.state';
import { ActionReducer, combineReducers } from '@ngrx/store';

import * as fromWallets from '@benchmarks/wallets/benchmarks-wallets.reducer';
import { BenchmarksWalletsAction, BenchmarksWalletsActions } from '@benchmarks/wallets/benchmarks-wallets.actions';

import * as fromTransactions from '@benchmarks/transactions/benchmarks-transactions.reducer';
import { BenchmarksTransactionsAction, BenchmarksTransactionsActions } from '@benchmarks/transactions/benchmarks-transactions.actions';

export type BenchmarksActions =
  & BenchmarksWalletsActions
  & BenchmarksTransactionsActions
export type BenchmarksAction =
  & BenchmarksWalletsAction
  & BenchmarksTransactionsAction

export const reducer: ActionReducer<BenchmarksState, BenchmarksActions> = combineReducers<BenchmarksState, BenchmarksActions>({
  wallets: fromWallets.reducer,
  transactions: fromTransactions.reducer,
});
