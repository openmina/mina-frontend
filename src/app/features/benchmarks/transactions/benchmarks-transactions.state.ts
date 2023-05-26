import { TableSort } from '@shared/types/shared/table-sort.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectBenchmarksTransactionsState } from '@benchmarks/benchmarks.state';
import { BenchmarksTransaction } from '@shared/types/benchmarks/transactions/benchmarks-transaction.type';

export interface BenchmarksTransactionsState {
  transactions: BenchmarksTransaction[];
  sort: TableSort<BenchmarksTransaction>;
}


const select = <T>(selector: (state: BenchmarksTransactionsState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectBenchmarksTransactionsState,
  selector,
);

export const selectBenchmarksTransactionList = select((state: BenchmarksTransactionsState): BenchmarksTransaction[] => state.transactions);
export const selectBenchmarksTransactionSort = select((state: BenchmarksTransactionsState): TableSort<BenchmarksTransaction> => state.sort);
