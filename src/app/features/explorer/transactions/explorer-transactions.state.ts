import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { selectExplorerTransactionsState } from '@explorer/explorer.state';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';

export interface ExplorerTransactionsState {
  transactions: ExplorerTransaction[];
  sort: TableSort<ExplorerTransaction>;
}

const select = <T>(selector: (state: ExplorerTransactionsState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectExplorerTransactionsState,
  selector,
);

export const selectExplorerTransactions = select((state: ExplorerTransactionsState): ExplorerTransaction[] => state.transactions);
export const selectExplorerTransactionsSorting = select((state: ExplorerTransactionsState): TableSort<ExplorerTransaction> => state.sort);
