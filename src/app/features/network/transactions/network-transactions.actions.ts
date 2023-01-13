import { FeatureAction } from '@shared/types/store/feature-action.type';
import { NetworkTransaction } from '@shared/types/network/transactions/network-transaction';

enum NetworkTransactionsActionTypes {
  NETWORK_TRANSACTIONS_INIT = 'NETWORK_TRANSACTIONS_INIT',
  NETWORK_TRANSACTIONS_CLOSE = 'NETWORK_TRANSACTIONS_CLOSE',
  NETWORK_TRANSACTIONS_GET_TRANSACTIONS = 'NETWORK_TRANSACTIONS_GET_TRANSACTIONS',
  NETWORK_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS = 'NETWORK_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS',
  NETWORK_TRANSACTIONS_SELECT_TRANSACTION = 'NETWORK_TRANSACTIONS_SELECT_TRANSACTION',
  NETWORK_TRANSACTIONS_GO_LIVE = 'NETWORK_TRANSACTIONS_GO_LIVE',
  NETWORK_TRANSACTIONS_PAUSE = 'NETWORK_TRANSACTIONS_PAUSE',
}

export const NETWORK_TRANSACTIONS_INIT = NetworkTransactionsActionTypes.NETWORK_TRANSACTIONS_INIT;
export const NETWORK_TRANSACTIONS_CLOSE = NetworkTransactionsActionTypes.NETWORK_TRANSACTIONS_CLOSE;
export const NETWORK_TRANSACTIONS_GET_TRANSACTIONS = NetworkTransactionsActionTypes.NETWORK_TRANSACTIONS_GET_TRANSACTIONS;
export const NETWORK_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS = NetworkTransactionsActionTypes.NETWORK_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS;
export const NETWORK_TRANSACTIONS_SELECT_TRANSACTION = NetworkTransactionsActionTypes.NETWORK_TRANSACTIONS_SELECT_TRANSACTION;
export const NETWORK_TRANSACTIONS_GO_LIVE = NetworkTransactionsActionTypes.NETWORK_TRANSACTIONS_GO_LIVE;
export const NETWORK_TRANSACTIONS_PAUSE = NetworkTransactionsActionTypes.NETWORK_TRANSACTIONS_PAUSE;

export interface NetworkTransactionsAction extends FeatureAction<NetworkTransactionsActionTypes> {
  readonly type: NetworkTransactionsActionTypes;
}

export class NetworkTransactionsInit implements NetworkTransactionsAction {
  readonly type = NETWORK_TRANSACTIONS_INIT;
}

export class NetworkTransactionsClose implements NetworkTransactionsAction {
  readonly type = NETWORK_TRANSACTIONS_CLOSE;
}

export class NetworkTransactionsGetTransactions implements NetworkTransactionsAction {
  readonly type = NETWORK_TRANSACTIONS_GET_TRANSACTIONS;
}

export class NetworkTransactionsGetTransactionsSuccess implements NetworkTransactionsAction {
  readonly type = NETWORK_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS;

  constructor(public payload: NetworkTransaction[]) {}
}

export class NetworkTransactionsSelectTransaction implements NetworkTransactionsAction {
  readonly type = NETWORK_TRANSACTIONS_SELECT_TRANSACTION;

  constructor(public payload: NetworkTransaction) {}
}

export class NetworkTransactionsGoLive implements NetworkTransactionsAction {
  readonly type = NETWORK_TRANSACTIONS_GO_LIVE;
}

export class NetworkTransactionsPause implements NetworkTransactionsAction {
  readonly type = NETWORK_TRANSACTIONS_PAUSE;
}

export type NetworkTransactionsActions =
  | NetworkTransactionsInit
  | NetworkTransactionsClose
  | NetworkTransactionsGetTransactions
  | NetworkTransactionsGetTransactionsSuccess
  | NetworkTransactionsSelectTransaction
  | NetworkTransactionsGoLive
  | NetworkTransactionsPause
  ;
