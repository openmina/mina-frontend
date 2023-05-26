import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { BenchmarksTransaction } from '@shared/types/benchmarks/transactions/benchmarks-transaction.type';

enum BenchmarksTransactionsActionTypes {
  BENCHMARKS_TRANSACTIONS_CLOSE = 'BENCHMARKS_TRANSACTIONS_CLOSE',
  BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS = 'BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS',
  BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS = 'BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS',
  BENCHMARKS_TRANSACTIONS_SORT = 'BENCHMARKS_TRANSACTIONS_SORT',
}

export const BENCHMARKS_TRANSACTIONS_CLOSE = BenchmarksTransactionsActionTypes.BENCHMARKS_TRANSACTIONS_CLOSE;
export const BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS = BenchmarksTransactionsActionTypes.BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS;
export const BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS = BenchmarksTransactionsActionTypes.BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS;
export const BENCHMARKS_TRANSACTIONS_SORT = BenchmarksTransactionsActionTypes.BENCHMARKS_TRANSACTIONS_SORT;

export interface BenchmarksTransactionsAction extends FeatureAction<BenchmarksTransactionsActionTypes> {
  readonly type: BenchmarksTransactionsActionTypes;
}

export class BenchmarksTransactionsClose implements BenchmarksTransactionsAction {
  readonly type = BENCHMARKS_TRANSACTIONS_CLOSE;
}

export class BenchmarksTransactionsGetTransactions implements BenchmarksTransactionsAction {
  readonly type = BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS;
}

export class BenchmarksTransactionsGetTransactionsSuccess implements BenchmarksTransactionsAction {
  readonly type = BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS;

  constructor(public readonly payload: BenchmarksTransaction[]) { }
}

export class BenchmarksTransactionsSort implements BenchmarksTransactionsAction {
  readonly type = BENCHMARKS_TRANSACTIONS_SORT;

  constructor(public readonly payload: TableSort<BenchmarksTransaction>) { }
}


export type BenchmarksTransactionsActions =
  | BenchmarksTransactionsClose
  | BenchmarksTransactionsGetTransactions
  | BenchmarksTransactionsGetTransactionsSuccess
  | BenchmarksTransactionsSort
  ;
