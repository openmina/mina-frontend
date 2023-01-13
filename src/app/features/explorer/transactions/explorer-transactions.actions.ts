import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';

enum ExplorerTransactionsActionTypes {
  EXPLORER_TRANSACTIONS_INIT = 'EXPLORER_TRANSACTIONS_INIT',
  EXPLORER_TRANSACTIONS_CLOSE = 'EXPLORER_TRANSACTIONS_CLOSE',
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS = 'EXPLORER_TRANSACTIONS_GET_TRANSACTIONS',
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS = 'EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS',
  EXPLORER_TRANSACTIONS_SORT = 'EXPLORER_TRANSACTIONS_SORT',
}

export const EXPLORER_TRANSACTIONS_INIT = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_INIT;
export const EXPLORER_TRANSACTIONS_CLOSE = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_CLOSE;
export const EXPLORER_TRANSACTIONS_GET_TRANSACTIONS = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_GET_TRANSACTIONS;
export const EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS;
export const EXPLORER_TRANSACTIONS_SORT = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_SORT;

export interface ExplorerTransactionsAction extends FeatureAction<ExplorerTransactionsActionTypes> {
  readonly type: ExplorerTransactionsActionTypes;
}

export class ExplorerTransactionsInit implements ExplorerTransactionsAction {
  readonly type = EXPLORER_TRANSACTIONS_INIT;
}

export class ExplorerTransactionsClose implements ExplorerTransactionsAction {
  readonly type = EXPLORER_TRANSACTIONS_CLOSE;
}

export class ExplorerTransactionsGetTransactions implements ExplorerTransactionsAction {
  readonly type = EXPLORER_TRANSACTIONS_GET_TRANSACTIONS;

  constructor(public payload?: { height: number }) {}
}

export class ExplorerTransactionsGetTransactionsSuccess implements ExplorerTransactionsAction {
  readonly type = EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS;

  constructor(public payload: ExplorerTransaction[]) {}
}

export class ExplorerTransactionsSort implements ExplorerTransactionsAction {
  readonly type = EXPLORER_TRANSACTIONS_SORT;

  constructor(public payload: TableSort<ExplorerTransaction>) { }
}

export type ExplorerTransactionsActions =
  | ExplorerTransactionsInit
  | ExplorerTransactionsClose
  | ExplorerTransactionsGetTransactions
  | ExplorerTransactionsGetTransactionsSuccess
  | ExplorerTransactionsSort
  ;
