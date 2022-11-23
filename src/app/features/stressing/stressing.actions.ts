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
}

export const STRESSING_INIT = StressingActionTypes.STRESSING_INIT;
export const STRESSING_CLOSE = StressingActionTypes.STRESSING_CLOSE;
export const STRESSING_GET_WALLETS = StressingActionTypes.STRESSING_GET_WALLETS;
export const STRESSING_GET_WALLETS_SUCCESS = StressingActionTypes.STRESSING_GET_WALLETS_SUCCESS;
export const STRESSING_GET_TRANSACTIONS = StressingActionTypes.STRESSING_GET_TRANSACTIONS;
export const STRESSING_GET_TRANSACTIONS_SUCCESS = StressingActionTypes.STRESSING_GET_TRANSACTIONS_SUCCESS;

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


export type StressingActions =
  | StressingInit
  | StressingClose
  | StressingGetWallets
  | StressingGetWalletsSuccess
  | StressingGetTransactions
  | StressingGetTransactionsSuccess
  ;
