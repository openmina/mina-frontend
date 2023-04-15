import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectWebNodeActiveTransaction, selectWebNodeTransactions } from '@web-node/web-node-wallet/web-node-wallet.state';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';
import { WEB_NODE_WALLET_SELECT_TRANSACTION, WebNodeWalletSelectTransaction } from '@web-node/web-node-wallet/web-node-wallet.actions';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-wallet-transactions',
  templateUrl: './web-node-wallet-transactions.component.html',
  styleUrls: ['./web-node-wallet-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class WebNodeWalletTransactionsComponent extends ManualDetection implements OnInit {

  itemSize: number = 32;
  transactions: WebNodeTransaction[];
  activeTransaction: WebNodeTransaction;

  @ViewChild(CdkVirtualScrollViewport) private virtualScroll: CdkVirtualScrollViewport;
  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<WebNodeTransaction>;

  @ViewChild('minaTable', { read: ViewContainerRef }) private containerRef: ViewContainerRef;
  private table: MinaTableComponent<WebNodeTransaction>;

  constructor(private store: Store<MinaState>) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent<MinaTableComponent<WebNodeTransaction>>(c.MinaTableComponent<WebNodeTransaction>).instance;
      this.table.rowClickEmitter.pipe(untilDestroyed(this)).subscribe((item: WebNodeTransaction) => this.onRowClick(item));
      this.table.headerCells = ['Transaction ID', 'From', 'To', 'Amount', 'Fee', 'Nonce', 'Memo', 'Status'];
      this.table.rowTemplate = this.rowTemplate;
      this.table.items = this.transactions;
      this.table.gridTemplateColumns = [100, 100, 100, 100, 100, 100, 100, 100];
      this.table.init();
    });
    this.listenToTransactionChanges();
  }

  private listenToTransactionChanges(): void {
    this.store.select(selectWebNodeTransactions)
      .pipe(untilDestroyed(this))
      .subscribe((transactions: WebNodeTransaction[]) => {
        this.transactions = transactions;
        this.table.items = this.transactions;
        this.table.detect();
      });

    this.store.select(selectWebNodeActiveTransaction)
      .pipe(untilDestroyed(this))
      .subscribe((activeTransaction: WebNodeTransaction) => {
        this.activeTransaction = activeTransaction;
        this.detect();
      });
  }

  onRowClick(transaction: WebNodeTransaction): void {
    this.store.dispatch<WebNodeWalletSelectTransaction>({ type: WEB_NODE_WALLET_SELECT_TRANSACTION, payload: transaction });
  }
}
