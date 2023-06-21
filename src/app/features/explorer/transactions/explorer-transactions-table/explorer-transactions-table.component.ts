import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';
import { selectExplorerTransactions, selectExplorerTransactionsSorting } from '@explorer/transactions/explorer-transactions.state';
import { ExplorerTransactionsSort } from '@explorer/transactions/explorer-transactions.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';

@Component({
  selector: 'mina-explorer-transactions-table',
  templateUrl: './explorer-transactions-table.component.html',
  styleUrls: ['./explorer-transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerTransactionsTableComponent extends MinaTableWrapper<ExplorerTransaction> implements OnInit {

  protected readonly tableHeads: TableColumnList<ExplorerTransaction> = [
    { name: 'transaction ID', sort: 'id' },
    { name: 'from' },
    { name: 'to' },
    { name: 'amount' },
    { name: 'fee' },
    { name: 'nonce' },
    { name: 'memo' },
    { name: 'status' },
  ];

  txs: ExplorerTransaction[] = [];

  constructor(private router: Router) { super() }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToBlocks();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [140, 140, 140, 90, 90, 80, 130, 100];
    this.table.sortClz = ExplorerTransactionsSort;
    this.table.sortSelector = selectExplorerTransactionsSorting;
  }

  private listenToBlocks(): void {
    this.select(selectExplorerTransactions, (txs: ExplorerTransaction[]) => {
      this.txs = txs;
      this.table.rows = txs;
      this.table.detect();
      this.detect();
    });
  }

  newTx(): void {
    this.router.navigate([Routes.EXPLORER, Routes.TRANSACTIONS, Routes.NEW]);
  }
}
