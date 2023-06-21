import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';
import { ExplorerSignedTransaction } from '@shared/types/explorer/transactions/explorer-signed-transaction.type';
import { ExplorerZkAppTransaction } from '@shared/types/explorer/transactions/explorer-zk-app-transaction.type';

enum ExplorerTransactionsActionTypes {
  EXPLORER_TRANSACTIONS_INIT = 'EXPLORER_TRANSACTIONS_INIT',
  EXPLORER_TRANSACTIONS_CLOSE = 'EXPLORER_TRANSACTIONS_CLOSE',
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS = 'EXPLORER_TRANSACTIONS_GET_TRANSACTIONS',
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS = 'EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS',
  EXPLORER_TRANSACTIONS_SORT = 'EXPLORER_TRANSACTIONS_SORT',
  EXPLORER_TRANSACTIONS_CREATE_TX = 'EXPLORER_TRANSACTIONS_CREATE_TX',
  EXPLORER_TRANSACTIONS_CREATE_TX_SUCCESS = 'EXPLORER_TRANSACTIONS_CREATE_TX_SUCCESS',
}

export const EXPLORER_TRANSACTIONS_INIT = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_INIT;
export const EXPLORER_TRANSACTIONS_CLOSE = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_CLOSE;
export const EXPLORER_TRANSACTIONS_GET_TRANSACTIONS = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_GET_TRANSACTIONS;
export const EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS;
export const EXPLORER_TRANSACTIONS_SORT = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_SORT;
export const EXPLORER_TRANSACTIONS_CREATE_TX = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_CREATE_TX;
export const EXPLORER_TRANSACTIONS_CREATE_TX_SUCCESS = ExplorerTransactionsActionTypes.EXPLORER_TRANSACTIONS_CREATE_TX_SUCCESS;

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

export class ExplorerTransactionsCreateTx implements ExplorerTransactionsAction {
  readonly type = EXPLORER_TRANSACTIONS_CREATE_TX;

  constructor(public payload: { txType: 'tx' | 'zk', tx: ExplorerSignedTransaction | ExplorerZkAppTransaction }) { }
}

export class ExplorerTransactionsCreateTxSuccess implements ExplorerTransactionsAction {
  readonly type = EXPLORER_TRANSACTIONS_CREATE_TX_SUCCESS;
}

export type ExplorerTransactionsActions =
  | ExplorerTransactionsInit
  | ExplorerTransactionsClose
  | ExplorerTransactionsGetTransactions
  | ExplorerTransactionsGetTransactionsSuccess
  | ExplorerTransactionsSort
  | ExplorerTransactionsCreateTx
  | ExplorerTransactionsCreateTxSuccess
  ;
