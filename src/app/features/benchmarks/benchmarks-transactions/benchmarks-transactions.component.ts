// import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// import { UntilDestroy } from '@ngneat/until-destroy';
// import { ManualDetection } from '@shared/base-classes/manual-detection.class';
// // import { selectBenchmarksFilters, selectBenchmarksSorting, selectBenchmarksStressingTransactions } from '../benchmarks.state';
// import { Store } from '@ngrx/store';
// import { MinaState } from '@app/app.setup';
// import { BenchmarksTransaction } from '@shared/types/benchmarks/benchmarks-transaction.type';
// // import {
// //   BENCHMARKS_TOGGLE_FILTER_TRANSACTIONS,
// //   BENCHMARKS_TRANSACTIONS_SORT,
// //   BenchmarksToggleFilterTransactions,
// //   BenchmarksTransactionsSort,
// // } from '../benchmarks.actions';
// import { TableSort } from '@shared/types/shared/table-sort.type';
// import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
//
// @UntilDestroy()
// @Component({
//   selector: 'mina-benchmarks-transactions',
//   templateUrl: './benchmarks-transactions.component.html',
//   styleUrls: ['./benchmarks-transactions.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   host: { class: 'h-100 flex-column' },
// })
// export class BenchmarksTransactionsComponent extends ManualDetection implements OnInit {
//
//   readonly allFilters: any[] = [
//     { name: 'Benchmark Transaction', value: 'benchmark' },
//     { name: 'Not Benchmark Transaction', value: 'not benchmark' },
//     { name: 'Transaction Pool', value: 'mempool' },
//   ];
//   activeFilters: any[] = [];
//   transactions: BenchmarksTransaction[] = [];
//   currentSort: TableSort<BenchmarksTransaction>;
//   readonly tableHeads: TableHeadSorting<BenchmarksTransaction>[] = [
//     { name: 'transaction ID', sort: 'id' },
//     { name: 'height', sort: 'blockHeight' },
//     { name: 'dateTime' },
//     { name: 'browser ID', sort: 'browserId' },
//     { name: 'counter' },
//     { name: 'from' },
//     { name: 'to' },
//     { name: 'amount' },
//     { name: 'fee' },
//     { name: 'nonce' },
//     { name: 'memo' },
//     { name: 'status' },
//     { name: 'benchmark tx.', sort: 'isBenchmarkTx' },
//   ];
//   readonly myBrowserId: number = Number(localStorage.getItem('browserId'));
//
//   constructor(private store: Store<MinaState>) { super(); }
//
//   ngOnInit(): void {
//     // this.listenToTransactionChanges();
//     // this.listenToFiltersChanges();
//     // this.listenToSortingChanges();
//   }
//
//   // private listenToTransactionChanges(): void {
//   //   this.store.select(selectBenchmarksStressingTransactions)
//   //     .pipe(untilDestroyed(this))
//   //     .subscribe(transactions => {
//   //       this.transactions = transactions;
//   //       this.detect();
//   //     });
//   // }
//   //
//   // private listenToSortingChanges(): void {
//   //   this.store.select(selectBenchmarksSorting)
//   //     .pipe(untilDestroyed(this))
//   //     .subscribe(sort => {
//   //       this.currentSort = sort;
//   //       this.detect();
//   //     });
//   // }
//   //
//   // private listenToFiltersChanges(): void {
//   //   this.store.select(selectBenchmarksFilters)
//   //     .pipe(untilDestroyed(this))
//   //     .subscribe(activeFilters => {
//   //       this.activeFilters = activeFilters;
//   //       this.detect();
//   //     });
//   // }
//   //
//   // sortTable(sortBy: string): void {
//   //   const sortDirection = sortBy !== this.currentSort.sortBy
//   //     ? this.currentSort.sortDirection
//   //     : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
//   //   this.store.dispatch<BenchmarksTransactionsSort>({
//   //     type: BENCHMARKS_TRANSACTIONS_SORT,
//   //     payload: { sortBy: sortBy as keyof BenchmarksTransaction, sortDirection },
//   //   });
//   // }
//   //
//   // toggleFilter(payload: any): void {
//   //   this.store.dispatch<BenchmarksToggleFilterTransactions>({ type: BENCHMARKS_TOGGLE_FILTER_TRANSACTIONS, payload });
//   // }
// }
