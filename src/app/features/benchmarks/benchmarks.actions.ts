import { FeatureAction } from '@shared/types/store/feature-action.type';
import { BenchmarksWallet } from '@shared/types/benchmarks/benchmarks-wallet.type';
import { ErrorAdd } from '@error-preview/error-preview.actions';
import { BenchmarksMempoolTx } from '@shared/types/benchmarks/benchmarks-mempool-tx.type';

enum BenchmarksActionTypes {
  BENCHMARKS_CLOSE = 'BENCHMARKS_CLOSE',
  BENCHMARKS_GET_WALLETS = 'BENCHMARKS_GET_WALLETS',
  BENCHMARKS_GET_WALLETS_SUCCESS = 'BENCHMARKS_GET_WALLETS_SUCCESS',
  BENCHMARKS_UPDATE_WALLETS_SUCCESS = 'BENCHMARKS_UPDATE_WALLETS_SUCCESS',
  BENCHMARKS_CHANGE_TRANSACTION_BATCH = 'BENCHMARKS_CHANGE_TRANSACTION_BATCH',
  BENCHMARKS_GET_MEMPOOL_TRANSACTIONS = 'BENCHMARKS_GET_MEMPOOL_TRANSACTIONS',
  BENCHMARKS_GET_MEMPOOL_TRANSACTIONS_SUCCESS = 'BENCHMARKS_GET_MEMPOOL_TRANSACTIONS_SUCCESS',
  BENCHMARKS_SEND_TXS = 'BENCHMARKS_SEND_TXS',
  BENCHMARKS_SEND_TX = 'BENCHMARKS_SEND_TX',
  BENCHMARKS_SEND_TX_SUCCESS = 'BENCHMARKS_SEND_TX_SUCCESS',
}

export const BENCHMARKS_CLOSE = BenchmarksActionTypes.BENCHMARKS_CLOSE;
export const BENCHMARKS_GET_WALLETS = BenchmarksActionTypes.BENCHMARKS_GET_WALLETS;
export const BENCHMARKS_GET_WALLETS_SUCCESS = BenchmarksActionTypes.BENCHMARKS_GET_WALLETS_SUCCESS;
export const BENCHMARKS_UPDATE_WALLETS_SUCCESS = BenchmarksActionTypes.BENCHMARKS_UPDATE_WALLETS_SUCCESS;
export const BENCHMARKS_CHANGE_TRANSACTION_BATCH = BenchmarksActionTypes.BENCHMARKS_CHANGE_TRANSACTION_BATCH;
export const BENCHMARKS_GET_MEMPOOL_TRANSACTIONS = BenchmarksActionTypes.BENCHMARKS_GET_MEMPOOL_TRANSACTIONS;
export const BENCHMARKS_GET_MEMPOOL_TRANSACTIONS_SUCCESS = BenchmarksActionTypes.BENCHMARKS_GET_MEMPOOL_TRANSACTIONS_SUCCESS;
export const BENCHMARKS_SEND_TXS = BenchmarksActionTypes.BENCHMARKS_SEND_TXS;
export const BENCHMARKS_SEND_TX = BenchmarksActionTypes.BENCHMARKS_SEND_TX;
export const BENCHMARKS_SEND_TX_SUCCESS = BenchmarksActionTypes.BENCHMARKS_SEND_TX_SUCCESS;

export interface BenchmarksAction extends FeatureAction<BenchmarksActionTypes> {
  readonly type: BenchmarksActionTypes;
}

export class BenchmarksClose implements BenchmarksAction {
  readonly type = BENCHMARKS_CLOSE;
}

export class BenchmarksGetWallets implements BenchmarksAction {
  readonly type = BENCHMARKS_GET_WALLETS;
}

export class BenchmarksGetWalletsSuccess implements BenchmarksAction {
  readonly type = BENCHMARKS_GET_WALLETS_SUCCESS;

  constructor(public payload: BenchmarksWallet[]) {}
}

export class BenchmarksUpdateWalletsSuccess implements BenchmarksAction {
  readonly type = BENCHMARKS_UPDATE_WALLETS_SUCCESS;

  constructor(public payload: BenchmarksWallet[]) {}
}

export class BenchmarksChangeTransactionBatch implements BenchmarksAction {
  readonly type = BENCHMARKS_CHANGE_TRANSACTION_BATCH;

  constructor(public payload: number) {}
}

export class BenchmarksGetMempoolTransactions implements BenchmarksAction {
  readonly type = BENCHMARKS_GET_MEMPOOL_TRANSACTIONS;
}

export class BenchmarksGetMempoolTransactionsSuccess implements BenchmarksAction {
  readonly type = BENCHMARKS_GET_MEMPOOL_TRANSACTIONS_SUCCESS;

  constructor(public payload: BenchmarksMempoolTx[]) {}
}

export class BenchmarksSendTxs implements BenchmarksAction {
  readonly type = BENCHMARKS_SEND_TXS;
}

export class BenchmarksSendTx implements BenchmarksAction {
  readonly type = BENCHMARKS_SEND_TX;

  constructor(public payload: any) {}
}

export class BenchmarksSendTxSuccess implements BenchmarksAction {
  readonly type = BENCHMARKS_SEND_TX_SUCCESS;

  constructor(public payload: any) {}
}


export type BenchmarksActions =
  | BenchmarksClose
  | BenchmarksGetWallets
  | BenchmarksGetWalletsSuccess
  | BenchmarksUpdateWalletsSuccess
  | BenchmarksChangeTransactionBatch
  | BenchmarksGetMempoolTransactions
  | BenchmarksGetMempoolTransactionsSuccess
  | BenchmarksSendTxs
  | BenchmarksSendTx
  | BenchmarksSendTxSuccess
  ;