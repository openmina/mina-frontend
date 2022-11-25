import { FeatureAction } from '@shared/types/store/feature-action.type';
import { StressingWallet } from '@shared/types/stressing/stressing-wallet.type';
import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';
import { SentTransactionsStats } from '@shared/types/stressing/sent-transactions-stats.type';

enum StressingActionTypes {
  STRESSING_INIT = 'STRESSING_INIT',
  STRESSING_CLOSE = 'STRESSING_CLOSE',
  STRESSING_GET_WALLETS = 'STRESSING_GET_WALLETS',
  STRESSING_GET_WALLETS_SUCCESS = 'STRESSING_GET_WALLETS_SUCCESS',
  STRESSING_GET_TRANSACTIONS = 'STRESSING_GET_TRANSACTIONS',
  STRESSING_GET_TRANSACTIONS_SUCCESS = 'STRESSING_GET_TRANSACTIONS_SUCCESS',
  STRESSING_GET_TRANSACTIONS_STATUSES_SUCCESS = 'STRESSING_GET_TRANSACTIONS_STATUSES_SUCCESS',
  STRESSING_SEND_TRANSACTIONS = 'STRESSING_SEND_TRANSACTIONS',
  STRESSING_CREATE_TRANSACTION = 'STRESSING_CREATE_TRANSACTION',
  STRESSING_CREATE_TRANSACTION_SUCCESS = 'STRESSING_CREATE_TRANSACTION_SUCCESS',
  STRESSING_CHANGE_TRANSACTION_BATCH = 'STRESSING_CHANGE_TRANSACTION_BATCH',
  STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL = 'STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL',
  STRESSING_STREAM_SENDING_PAUSE = 'STRESSING_STREAM_SENDING_PAUSE',
  STRESSING_STREAM_SENDING_LIVE = 'STRESSING_STREAM_SENDING_LIVE',
  STRESSING_TOGGLE_FILTER_TRANSACTIONS = 'STRESSING_TOGGLE_FILTER_TRANSACTIONS',
}

export const STRESSING_INIT = StressingActionTypes.STRESSING_INIT;
export const STRESSING_CLOSE = StressingActionTypes.STRESSING_CLOSE;
export const STRESSING_GET_WALLETS = StressingActionTypes.STRESSING_GET_WALLETS;
export const STRESSING_GET_WALLETS_SUCCESS = StressingActionTypes.STRESSING_GET_WALLETS_SUCCESS;
export const STRESSING_GET_TRANSACTIONS = StressingActionTypes.STRESSING_GET_TRANSACTIONS;
export const STRESSING_GET_TRANSACTIONS_SUCCESS = StressingActionTypes.STRESSING_GET_TRANSACTIONS_SUCCESS;
export const STRESSING_GET_TRANSACTIONS_STATUSES_SUCCESS = StressingActionTypes.STRESSING_GET_TRANSACTIONS_STATUSES_SUCCESS;
export const STRESSING_SEND_TRANSACTIONS = StressingActionTypes.STRESSING_SEND_TRANSACTIONS;
export const STRESSING_CREATE_TRANSACTION = StressingActionTypes.STRESSING_CREATE_TRANSACTION;
export const STRESSING_CREATE_TRANSACTION_SUCCESS = StressingActionTypes.STRESSING_CREATE_TRANSACTION_SUCCESS;
export const STRESSING_CHANGE_TRANSACTION_BATCH = StressingActionTypes.STRESSING_CHANGE_TRANSACTION_BATCH;
export const STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL = StressingActionTypes.STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL;
export const STRESSING_STREAM_SENDING_PAUSE = StressingActionTypes.STRESSING_STREAM_SENDING_PAUSE;
export const STRESSING_STREAM_SENDING_LIVE = StressingActionTypes.STRESSING_STREAM_SENDING_LIVE;
export const STRESSING_TOGGLE_FILTER_TRANSACTIONS = StressingActionTypes.STRESSING_TOGGLE_FILTER_TRANSACTIONS;

export interface StressingAction extends FeatureAction<StressingActionTypes> {
  readonly type: StressingActionTypes;
}

export class StressingInit implements StressingAction {
  readonly type = STRESSING_INIT;
}

export class StressingClose implements StressingAction {
  readonly type = STRESSING_CLOSE;
}

export class StressingGetWallets implements StressingAction {
  readonly type = STRESSING_GET_WALLETS;
}

export class StressingGetWalletsSuccess implements StressingAction {
  readonly type = STRESSING_GET_WALLETS_SUCCESS;

  constructor(public payload: StressingWallet[]) {}
}

export class StressingGetTransactions implements StressingAction {
  readonly type = STRESSING_GET_TRANSACTIONS;
}

export class StressingGetTransactionsSuccess implements StressingAction {
  readonly type = STRESSING_GET_TRANSACTIONS_SUCCESS;

  constructor(public payload: StressingTransaction[]) {}
}

export class StressingGetTransactionsStatusesSuccess implements StressingAction {
  readonly type = STRESSING_GET_TRANSACTIONS_STATUSES_SUCCESS;

  constructor(public payload: { [id: string]: string }) {}
}

export class StressingSendTransactions implements StressingAction {
  readonly type = STRESSING_SEND_TRANSACTIONS;
}

export class StressingCreateTransaction implements StressingAction {
  readonly type = STRESSING_CREATE_TRANSACTION;

  constructor(public payload: { from: StressingWallet, to: string }) {}
}

export class StressingCreateTransactionSuccess implements StressingAction {
  readonly type = STRESSING_CREATE_TRANSACTION_SUCCESS;

  constructor(public payload: SentTransactionsStats) {}
}

export class StressingChangeTransactionBatch implements StressingAction {
  readonly type = STRESSING_CHANGE_TRANSACTION_BATCH;

  constructor(public payload: number) {}
}

export class StressingChangeTransactionSendingInterval implements StressingAction {
  readonly type = STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL;

  constructor(public payload: number) {}
}

export class StressingStreamSendingPause implements StressingAction {
  readonly type = STRESSING_STREAM_SENDING_PAUSE;
}

export class StressingStreamSendingLive implements StressingAction {
  readonly type = STRESSING_STREAM_SENDING_LIVE;
}

export class StressingToggleFilterTransactions implements StressingAction {
  readonly type = STRESSING_TOGGLE_FILTER_TRANSACTIONS;

  constructor(public payload: boolean) {}
}


export type StressingActions =
  | StressingInit
  | StressingClose
  | StressingGetWallets
  | StressingGetWalletsSuccess
  | StressingGetTransactions
  | StressingGetTransactionsSuccess
  | StressingSendTransactions
  | StressingCreateTransaction
  | StressingCreateTransactionSuccess
  | StressingGetTransactionsStatusesSuccess
  | StressingChangeTransactionBatch
  | StressingChangeTransactionSendingInterval
  | StressingStreamSendingPause
  | StressingStreamSendingLive
  | StressingToggleFilterTransactions
  ;
