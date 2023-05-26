import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { selectWebNodeActiveTransaction, selectWebNodeTransactions } from '@web-node/web-node-wallet/web-node-wallet.state';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';
import { WebNodeWalletSelectTransaction } from '@web-node/web-node-wallet/web-node-wallet.actions';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-wallet-transactions',
  templateUrl: './web-node-wallet-transactions.component.html',
  styleUrls: ['./web-node-wallet-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class WebNodeWalletTransactionsComponent extends StoreDispatcher implements OnInit {

  itemSize: number = 32;
  transactions: WebNodeTransaction[];
  activeTransaction: WebNodeTransaction;

  @ViewChild(CdkVirtualScrollViewport) private virtualScroll: CdkVirtualScrollViewport;

  ngOnInit(): void {
    this.listenToTransactionChanges();
  }

  private listenToTransactionChanges(): void {
    this.select(selectWebNodeTransactions, (transactions: WebNodeTransaction[]) => {
      this.transactions = transactions;
      this.detect();
    });

    this.select(selectWebNodeActiveTransaction, (activeTransaction: WebNodeTransaction) => {
      this.activeTransaction = activeTransaction;
      this.detect();
    });
  }

  onRowClick(transaction: WebNodeTransaction): void {
    this.dispatch(WebNodeWalletSelectTransaction, transaction);
  }
}
