import { FeatureAction } from '@shared/types/store/feature-action.type';
import { StressingWallet } from '@shared/types/stressing/stressing-wallet.type';
import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';

enum StressingActionTypes {
  STRESSING_INIT = 'STRESSING_INIT',
  STRESSING_CLOSE = 'STRESSING_CLOSE',
  STRESSING_GET_WALLETS = 'STRESSING_GET_WALLETS',
  STRESSING_GET_WALLETS_SUCCESS = 'STRESSING_GET_WALLETS_SUCCESS',
  STRESSING_GET_TRANSACTIONS = 'STRESSING_GET_TRANSACTIONS',
  STRESSING_GET_TRANSACTIONS_SUCCESS = 'STRESSING_GET_TRANSACTIONS_SUCCESS',
  STRESSING_SEND_TRANSACTIONS = 'STRESSING_SEND_TRANSACTIONS',
  STRESSING_SEND_TRANSACTIONS_SUCCESS = 'STRESSING_SEND_TRANSACTIONS_SUCCESS',
  STRESSING_CHANGE_TRANSACTION_BATCH = 'STRESSING_CHANGE_TRANSACTION_BATCH',
  STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL = 'STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL',
}

export const STRESSING_INIT = StressingActionTypes.STRESSING_INIT;
export const STRESSING_CLOSE = StressingActionTypes.STRESSING_CLOSE;
export const STRESSING_GET_WALLETS = StressingActionTypes.STRESSING_GET_WALLETS;
export const STRESSING_GET_WALLETS_SUCCESS = StressingActionTypes.STRESSING_GET_WALLETS_SUCCESS;
export const STRESSING_GET_TRANSACTIONS = StressingActionTypes.STRESSING_GET_TRANSACTIONS;
export const STRESSING_GET_TRANSACTIONS_SUCCESS = StressingActionTypes.STRESSING_GET_TRANSACTIONS_SUCCESS;
export const STRESSING_SEND_TRANSACTIONS = StressingActionTypes.STRESSING_SEND_TRANSACTIONS;
export const STRESSING_SEND_TRANSACTIONS_SUCCESS = StressingActionTypes.STRESSING_SEND_TRANSACTIONS_SUCCESS;
export const STRESSING_CHANGE_TRANSACTION_BATCH = StressingActionTypes.STRESSING_CHANGE_TRANSACTION_BATCH;
export const STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL = StressingActionTypes.STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL;

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

export class StressingSendTransactions implements StressingAction {
  readonly type = STRESSING_SEND_TRANSACTIONS;
}

export class StressingSendTransactionsSuccess implements StressingAction {
  readonly type = STRESSING_SEND_TRANSACTIONS_SUCCESS;

  constructor(public payload: any) {}
}

export class StressingChangeTransactionBatch implements StressingAction {
  readonly type = STRESSING_CHANGE_TRANSACTION_BATCH;

  constructor(public payload: number) {}
}

export class StressingChangeTransactionSendingInterval implements StressingAction {
  readonly type = STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL;

  constructor(public payload: number) {}
}


export type StressingActions =
  | StressingInit
  | StressingClose
  | StressingGetWallets
  | StressingGetWalletsSuccess
  | StressingGetTransactions
  | StressingGetTransactionsSuccess
  | StressingSendTransactions
  | StressingSendTransactionsSuccess
  | StressingChangeTransactionBatch
  | StressingChangeTransactionSendingInterval
  ;
