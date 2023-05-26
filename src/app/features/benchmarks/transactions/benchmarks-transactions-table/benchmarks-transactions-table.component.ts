import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { BenchmarksTransaction } from '@shared/types/benchmarks/transactions/benchmarks-transaction.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectBenchmarksTransactionList, selectBenchmarksTransactionSort } from '@benchmarks/transactions/benchmarks-transactions.state';
import { BenchmarksTransactionsSort } from '@benchmarks/transactions/benchmarks-transactions.actions';

@Component({
  selector: 'mina-benchmarks-transactions-table',
  templateUrl: './benchmarks-transactions-table.component.html',
  styleUrls: ['./benchmarks-transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class BenchmarksTransactionsTableComponent extends StoreDispatcher implements OnInit {

  transactions: BenchmarksTransaction[] = [];
  currentSort: TableSort<BenchmarksTransaction>;

  readonly tableHeads: TableHeadSorting<BenchmarksTransaction>[] = [
    { name: 'date' },
    { name: 'from' },
    { name: 'to' },
    { name: 'nonce' },
    { name: 'amount' },
    { name: 'fee' },
    { name: 'memo' },
    { name: 'valid until', sort: 'validUntil' },
  ];

  ngOnInit(): void {
    this.listenToTransactionChanges();
    this.listenToSortingChanges();
  }

  private listenToTransactionChanges(): void {
    this.select(selectBenchmarksTransactionList, (transactions: BenchmarksTransaction[]) => {
      this.transactions = transactions;
      this.detect();
    });
  }

  private listenToSortingChanges(): void {
    this.select(selectBenchmarksTransactionSort, (sort: TableSort<BenchmarksTransaction>) => {
      this.currentSort = sort;
      this.detect();
    });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(BenchmarksTransactionsSort, { sortBy: sortBy as keyof BenchmarksTransaction, sortDirection });
  }
}
