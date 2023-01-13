import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';
import { selectExplorerTransactions, selectExplorerTransactionsSorting } from '@explorer/transactions/explorer-transactions.state';
import { EXPLORER_TRANSACTIONS_SORT, ExplorerTransactionsSort } from '@explorer/transactions/explorer-transactions.actions';

@UntilDestroy()
@Component({
  selector: 'mina-explorer-transactions-table',
  templateUrl: './explorer-transactions-table.component.html',
  styleUrls: ['./explorer-transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerTransactionsTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;
  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<ExplorerTransaction>[] = [
    { name: 'transaction ID', sort: 'id' },
    { name: 'from' },
    { name: 'to' },
    { name: 'amount' },
    { name: 'fee' },
    { name: 'nonce' },
    { name: 'memo' },
    { name: 'status' },
  ];
  readonly myBrowserId: number = Number(localStorage.getItem('browserId'));

  txs: ExplorerTransaction[] = [];
  currentSort: TableSort<ExplorerTransaction>;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToSortingChanges();
    this.listenToBlocks();
  }

  private listenToBlocks(): void {
    this.store.select(selectExplorerTransactions)
      .pipe(untilDestroyed(this))
      .subscribe((txs: ExplorerTransaction[]) => {
        this.txs = txs;
        this.detect();
      });
  }

  private listenToSortingChanges(): void {
    this.store.select(selectExplorerTransactionsSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.detect();
      });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<ExplorerTransactionsSort>({
      type: EXPLORER_TRANSACTIONS_SORT,
      payload: { sortBy: sortBy as keyof ExplorerTransaction, sortDirection },
    });
  }
}
