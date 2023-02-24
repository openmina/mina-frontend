import { BenchmarksWallet } from '@shared/types/benchmarks/benchmarks-wallet.type';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { SentTransactionsStats } from '@shared/types/benchmarks/sent-transactions-stats.type';
import { BenchmarksMempoolTx } from '@shared/types/benchmarks/benchmarks-mempool-tx.type';
import { BenchmarksTransaction } from '@shared/types/benchmarks/benchmarks-transaction.type';


export interface BenchmarksState {
  wallets: BenchmarksWallet[];
  blockSending: boolean;
  txSendingBatch: number;
  sentTransactions: SentTransactionsStats;
  sentTxCount: number;
  mempoolTxs: BenchmarksMempoolTx[];
  txsToSend: BenchmarksTransaction[];
  randomWallet: boolean;
  activeWallet: BenchmarksWallet;
  sendingFee: number;
}

const select = <T>(selector: (state: BenchmarksState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectBenchmarksState,
  selector,
);

export const selectBenchmarksState = createFeatureSelector<BenchmarksState>('benchmarks');
export const selectBenchmarksWallets = select((state: BenchmarksState): BenchmarksWallet[] => state.wallets);
export const selectBenchmarksBlockSending = select((state: BenchmarksState): boolean => state.blockSending || state.txsToSend.length > 0);
export const selectBenchmarksSentTransactionsStats = select((state: BenchmarksState): SentTransactionsStats => state.sentTransactions);
export const selectBenchmarksSendingBatch = select((state: BenchmarksState): number => state.txSendingBatch);
export const selectBenchmarksSendingFee = select((state: BenchmarksState): number => state.sendingFee);
export const selectBenchmarksRandomWallet = select((state: BenchmarksState): boolean => state.randomWallet);
export const selectBenchmarksActiveWallet = select((state: BenchmarksState): BenchmarksWallet => state.activeWallet);
