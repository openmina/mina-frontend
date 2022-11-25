import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';
import { StressingWallet } from '@shared/types/stressing/stressing-wallet.type';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { SentTransactionsStats } from '@shared/types/stressing/sent-transactions-stats.type';


export interface StressingState {
  wallets: StressingWallet[];
  transactions: StressingTransaction[];
  filteredTransactions: StressingTransaction[];
  activeTransaction: StressingTransaction;
  intervalDuration: number;
  trSendingBatch: number;
  streamSending: boolean;
  filters: boolean[];
  sentTransactions: SentTransactionsStats;
}

const select = <T>(selector: (state: StressingState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectStressingState,
  selector,
);

export const selectStressingState = createFeatureSelector<StressingState>('stressing');
export const selectStressingWallets = select((state: StressingState): StressingWallet[] => state.wallets);
export const selectStressingTransactions = select((state: StressingState): StressingTransaction[] => state.filteredTransactions);
export const selectStressingStreamSending = select((state: StressingState): boolean => state.streamSending);
export const selectStressingFilters = select((state: StressingState): boolean[] => state.filters);
export const selectStressingSentTransactionsStats = select((state: StressingState): SentTransactionsStats => state.sentTransactions);
export const selectStressingFetchingValues = select((state: StressingState): { interval: number, batch: number } => ({
  interval: state.intervalDuration,
  batch: state.trSendingBatch,
}));
