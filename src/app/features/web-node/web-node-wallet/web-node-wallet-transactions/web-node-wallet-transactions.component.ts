import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectWebNodeActiveTransaction, selectWebNodeTransactions } from '@web-node/web-node-wallet/web-node-wallet.state';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';
import { WEB_NODE_WALLET_SELECT_TRANSACTION, WebNodeWalletSelectTransaction } from '@web-node/web-node-wallet/web-node-wallet.actions';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-wallet-transactions',
  templateUrl: './web-node-wallet-transactions.component.html',
  styleUrls: ['./web-node-wallet-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class WebNodeWalletTransactionsComponent extends ManualDetection implements OnInit {

  transactions: WebNodeTransaction[];
  activeTransaction: WebNodeTransaction;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToTransactionChanges();
  }

  private listenToTransactionChanges(): void {
    this.store.select(selectWebNodeTransactions)
      .pipe(untilDestroyed(this))
      .subscribe((transactions: WebNodeTransaction[]) => {
        this.transactions = transactions;
        this.detect();
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
