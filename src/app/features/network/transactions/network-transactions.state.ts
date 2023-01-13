import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkTransactionsState } from '@network/network.state';
import { NetworkTransaction } from '@shared/types/network/transactions/network-transaction';

export interface NetworkTransactionsState {
  transactions: NetworkTransaction[];
  activeTransaction: NetworkTransaction;
  stream: boolean;
}

const select = <T>(selector: (state: NetworkTransactionsState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectNetworkTransactionsState,
  selector,
);

export const selectNetworkTransactions = select((state: NetworkTransactionsState): NetworkTransaction[] => state.transactions);
export const selectNetworkSnarksActiveTransaction = select((state: NetworkTransactionsState): NetworkTransaction => state.activeTransaction);
