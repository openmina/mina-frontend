import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';
import { selectExplorerTransactions, selectExplorerTransactionsSorting } from '@explorer/transactions/explorer-transactions.state';
import { ExplorerTransactionsSort } from '@explorer/transactions/explorer-transactions.actions';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';

@Component({
  selector: 'mina-explorer-transactions-table',
  templateUrl: './explorer-transactions-table.component.html',
  styleUrls: ['./explorer-transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerTransactionsTableComponent extends StoreDispatcher implements OnInit {

  private readonly tableHeads: TableColumnList<ExplorerTransaction> = [
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

  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<ExplorerTransaction>;
  @ViewChild('minaTable', { read: ViewContainerRef }) private containerRef: ViewContainerRef;

  private table: MinaTableComponent<ExplorerTransaction>;

  constructor(private router: Router) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<ExplorerTransaction>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = this.rowTemplate;
      this.table.gridTemplateColumns = [140, 140, 140, 90, 90, 80, 130, 100];
      this.table.sortClz = ExplorerTransactionsSort;
      this.table.sortSelector = selectExplorerTransactionsSorting;
      this.table.init();
    });
    this.listenToBlocks();
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
