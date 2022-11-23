import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';
import { StressingWallet } from '@shared/types/stressing/stressing-wallet.type';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';

export interface StressingState {
  wallets: StressingWallet[];
  transactions: StressingTransaction[];
  activeTransaction: StressingTransaction;
  intervalDuration: number;
  trSendingBatch: number;
}

const select = <T>(selector: (state: StressingState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectStressingState,
  selector,
);

export const selectStressingState = createFeatureSelector<StressingState>('stressing');
export const selectStressingWallets = select((state: StressingState): StressingWallet[] => state.wallets);
export const selectStressingTransactions = select((state: StressingState): StressingTransaction[] => state.transactions);
export const selectStressingFetchingValues = select((state: StressingState): { interval: number, batch: number } => ({
  interval: state.intervalDuration,
  batch: state.trSendingBatch,
}));
