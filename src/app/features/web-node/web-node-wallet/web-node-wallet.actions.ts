import { FeatureAction } from '@shared/types/store/feature-action.type';
import { WebNodeWallet } from '@shared/types/web-node/wallet/web-node-wallet.type';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';

enum WebNodeWalletActionTypes {
  WEB_NODE_WALLET_GET_WALLETS = 'WEB_NODE_WALLET_GET_WALLETS',
  WEB_NODE_WALLET_GET_WALLETS_SUCCESS = 'WEB_NODE_WALLET_GET_WALLETS_SUCCESS',
  WEB_NODE_WALLET_CHANGE_WALLET = 'WEB_NODE_WALLET_CHANGE_WALLET',
  WEB_NODE_WALLET_CREATE_TRANSACTION = 'WEB_NODE_WALLET_CREATE_TRANSACTION',
  WEB_NODE_WALLET_GET_TRANSACTIONS = 'WEB_NODE_WALLET_GET_TRANSACTIONS',
  WEB_NODE_WALLET_GET_TRANSACTIONS_SUCCESS = 'WEB_NODE_WALLET_GET_TRANSACTIONS_SUCCESS',
  WEB_NODE_WALLET_GET_TRANSACTIONS_STATUSES_SUCCESS = 'WEB_NODE_WALLET_GET_TRANSACTIONS_STATUSES_SUCCESS',
  WEB_NODE_WALLET_SELECT_TRANSACTION = 'WEB_NODE_WALLET_SELECT_TRANSACTION',
  WEB_NODE_WALLET_CLOSE = 'WEB_NODE_WALLET_CLOSE',
}

export const WEB_NODE_WALLET_GET_WALLETS = WebNodeWalletActionTypes.WEB_NODE_WALLET_GET_WALLETS;
export const WEB_NODE_WALLET_GET_WALLETS_SUCCESS = WebNodeWalletActionTypes.WEB_NODE_WALLET_GET_WALLETS_SUCCESS;
export const WEB_NODE_WALLET_CHANGE_WALLET = WebNodeWalletActionTypes.WEB_NODE_WALLET_CHANGE_WALLET;
export const WEB_NODE_WALLET_CREATE_TRANSACTION = WebNodeWalletActionTypes.WEB_NODE_WALLET_CREATE_TRANSACTION;
export const WEB_NODE_WALLET_GET_TRANSACTIONS = WebNodeWalletActionTypes.WEB_NODE_WALLET_GET_TRANSACTIONS;
export const WEB_NODE_WALLET_GET_TRANSACTIONS_SUCCESS = WebNodeWalletActionTypes.WEB_NODE_WALLET_GET_TRANSACTIONS_SUCCESS;
export const WEB_NODE_WALLET_GET_TRANSACTIONS_STATUSES_SUCCESS = WebNodeWalletActionTypes.WEB_NODE_WALLET_GET_TRANSACTIONS_STATUSES_SUCCESS;
export const WEB_NODE_WALLET_SELECT_TRANSACTION = WebNodeWalletActionTypes.WEB_NODE_WALLET_SELECT_TRANSACTION;
export const WEB_NODE_WALLET_CLOSE = WebNodeWalletActionTypes.WEB_NODE_WALLET_CLOSE;

export interface WebNodeWalletAction extends FeatureAction<WebNodeWalletActionTypes> {
  readonly type: WebNodeWalletActionTypes;
}

export class WebNodeWalletGetWallets implements WebNodeWalletAction {
  readonly type = WEB_NODE_WALLET_GET_WALLETS;
}

export class WebNodeWalletGetWalletsSuccess implements WebNodeWalletAction {
  readonly type = WEB_NODE_WALLET_GET_WALLETS_SUCCESS;

  constructor(public payload: WebNodeWallet[]) {}
}

export class WebNodeWalletChangeWallet implements WebNodeWalletAction {
  readonly type = WEB_NODE_WALLET_CHANGE_WALLET;

  constructor(public payload: WebNodeWallet) {}
}

export class WebNodeWalletCreateTransaction implements WebNodeWalletAction {
  readonly type = WEB_NODE_WALLET_CREATE_TRANSACTION;

  constructor(public payload: WebNodeTransaction) {}
}

export class WebNodeWalletGetTransactions implements WebNodeWalletAction {
  readonly type = WEB_NODE_WALLET_GET_TRANSACTIONS;

  constructor(public payload: { publicKey: string }) {}
}

export class WebNodeWalletGetTransactionsSuccess implements WebNodeWalletAction {
  readonly type = WEB_NODE_WALLET_GET_TRANSACTIONS_SUCCESS;

  constructor(public payload: WebNodeTransaction[]) {}
}

export class WebNodeWalletGetTransactionsStatusesSuccess implements WebNodeWalletAction {
  readonly type = WEB_NODE_WALLET_GET_TRANSACTIONS_STATUSES_SUCCESS;

  constructor(public payload: { [id: string]: string }) {}
}

export class WebNodeWalletSelectTransaction implements WebNodeWalletAction {
  readonly type = WEB_NODE_WALLET_SELECT_TRANSACTION;

  constructor(public payload: WebNodeTransaction) {}
}

export class WebNodeWalletClose implements WebNodeWalletAction {
  readonly type = WEB_NODE_WALLET_CLOSE;
}

export type WebNodeWalletActions =
  | WebNodeWalletGetWallets
  | WebNodeWalletGetWalletsSuccess
  | WebNodeWalletChangeWallet
  | WebNodeWalletCreateTransaction
  | WebNodeWalletGetTransactions
  | WebNodeWalletGetTransactionsSuccess
  | WebNodeWalletGetTransactionsStatusesSuccess
  | WebNodeWalletSelectTransaction
  | WebNodeWalletClose
  ;
