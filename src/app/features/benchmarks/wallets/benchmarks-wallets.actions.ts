import { FeatureAction } from '@shared/types/store/feature-action.type';
import { BenchmarksWallet } from '@shared/types/benchmarks/wallets/benchmarks-wallet.type';
import { BenchmarksMempoolTx } from '@shared/types/benchmarks/wallets/benchmarks-mempool-tx.type';
import { BenchmarksWalletTransaction } from '@shared/types/benchmarks/wallets/benchmarks-wallet-transaction.type';

enum BenchmarksWalletsActionTypes {
  BENCHMARKS_WALLETS_CLOSE = 'BENCHMARKS_WALLETS_CLOSE',
  BENCHMARKS_WALLETS_GET_WALLETS = 'BENCHMARKS_WALLETS_GET_WALLETS',
  BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS = 'BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS',
  BENCHMARKS_WALLETS_UPDATE_WALLETS_SUCCESS = 'BENCHMARKS_WALLETS_UPDATE_WALLETS_SUCCESS',
  BENCHMARKS_WALLETS_CHANGE_TRANSACTION_BATCH = 'BENCHMARKS_WALLETS_CHANGE_TRANSACTION_BATCH',
  BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS = 'BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS',
  BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS_SUCCESS = 'BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS_SUCCESS',
  BENCHMARKS_WALLETS_SEND_TXS = 'BENCHMARKS_WALLETS_SEND_TXS',
  BENCHMARKS_WALLETS_SEND_TX = 'BENCHMARKS_WALLETS_SEND_TX',
  BENCHMARKS_WALLETS_SEND_TX_SYNCED = 'BENCHMARKS_WALLETS_SEND_TX_SYNCED',
  BENCHMARKS_WALLETS_SEND_TX_SUCCESS = 'BENCHMARKS_WALLETS_SEND_TX_SUCCESS',
  BENCHMARKS_WALLETS_TOGGLE_RANDOM_WALLET = 'BENCHMARKS_WALLETS_TOGGLE_RANDOM_WALLET',
  BENCHMARKS_WALLETS_SELECT_WALLET = 'BENCHMARKS_WALLETS_SELECT_WALLET',
  BENCHMARKS_WALLETS_CHANGE_FEE = 'BENCHMARKS_WALLETS_CHANGE_FEE',
}

export const BENCHMARKS_WALLETS_CLOSE = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_CLOSE;
export const BENCHMARKS_WALLETS_GET_WALLETS = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_GET_WALLETS;
export const BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS;
export const BENCHMARKS_WALLETS_UPDATE_WALLETS_SUCCESS = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_UPDATE_WALLETS_SUCCESS;
export const BENCHMARKS_WALLETS_CHANGE_TRANSACTION_BATCH = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_CHANGE_TRANSACTION_BATCH;
export const BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS;
export const BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS_SUCCESS = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS_SUCCESS;
export const BENCHMARKS_WALLETS_SEND_TXS = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_SEND_TXS;
export const BENCHMARKS_WALLETS_SEND_TX = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_SEND_TX;
export const BENCHMARKS_WALLETS_SEND_TX_SYNCED = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_SEND_TX_SYNCED;
export const BENCHMARKS_WALLETS_SEND_TX_SUCCESS = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_SEND_TX_SUCCESS;
export const BENCHMARKS_WALLETS_TOGGLE_RANDOM_WALLET = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_TOGGLE_RANDOM_WALLET;
export const BENCHMARKS_WALLETS_SELECT_WALLET = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_SELECT_WALLET;
export const BENCHMARKS_WALLETS_CHANGE_FEE = BenchmarksWalletsActionTypes.BENCHMARKS_WALLETS_CHANGE_FEE;

export interface BenchmarksWalletsAction extends FeatureAction<BenchmarksWalletsActionTypes> {
  readonly type: BenchmarksWalletsActionTypes;
}

export class BenchmarksWalletsClose implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_CLOSE;
}

export class BenchmarksWalletsGetWallets implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_GET_WALLETS;
}

export class BenchmarksWalletsGetWalletsSuccess implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS;

  constructor(public payload: BenchmarksWallet[]) {}
}

export class BenchmarksWalletsUpdateWalletsSuccess implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_UPDATE_WALLETS_SUCCESS;

  constructor(public payload: BenchmarksWallet[]) {}
}

export class BenchmarksWalletsChangeTransactionBatch implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_CHANGE_TRANSACTION_BATCH;

  constructor(public payload: number) {}
}

export class BenchmarksWalletsGetMempoolTransactions implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS;
}

export class BenchmarksWalletsGetMempoolTransactionsSuccess implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS_SUCCESS;

  constructor(public payload: BenchmarksMempoolTx[]) {}
}

export class BenchmarksWalletsSendTxs implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_SEND_TXS;
}

export class BenchmarksWalletsSendTx implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_SEND_TX;

  constructor(public payload: any) {}
}

export class BenchmarksWalletsSendTxSynced implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_SEND_TX_SYNCED;

  constructor(public payload: BenchmarksWalletTransaction[]) {}
}

export class BenchmarksWalletsSendTxSuccess implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_SEND_TX_SUCCESS;

  constructor(public payload: any) {}
}

export class BenchmarksWalletsToggleRandomWallet implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_TOGGLE_RANDOM_WALLET;
}

export class BenchmarksWalletsSelectWallet implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_SELECT_WALLET;

  constructor(public payload: BenchmarksWallet) {}
}

export class BenchmarksWalletsChangeFee implements BenchmarksWalletsAction {
  readonly type = BENCHMARKS_WALLETS_CHANGE_FEE;

  constructor(public payload: number) {}
}


export type BenchmarksWalletsActions =
  | BenchmarksWalletsClose
  | BenchmarksWalletsGetWallets
  | BenchmarksWalletsGetWalletsSuccess
  | BenchmarksWalletsUpdateWalletsSuccess
  | BenchmarksWalletsChangeTransactionBatch
  | BenchmarksWalletsGetMempoolTransactions
  | BenchmarksWalletsGetMempoolTransactionsSuccess
  | BenchmarksWalletsSendTxs
  | BenchmarksWalletsSendTx
  | BenchmarksWalletsSendTxSynced
  | BenchmarksWalletsSendTxSuccess
  | BenchmarksWalletsToggleRandomWallet
  | BenchmarksWalletsSelectWallet
  | BenchmarksWalletsChangeFee
  ;
