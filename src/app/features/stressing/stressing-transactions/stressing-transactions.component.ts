import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectStressingTransactions } from '@stressing/stressing.state';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';

@UntilDestroy()
@Component({
  selector: 'mina-stressing-transactions',
  templateUrl: './stressing-transactions.component.html',
  styleUrls: ['./stressing-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class StressingTransactionsComponent extends ManualDetection implements OnInit {

  transactions: StressingTransaction[] = [];

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToTransactionChanges();
  }

  private listenToTransactionChanges(): void {
    this.store.select(selectStressingTransactions)
      .pipe(untilDestroyed(this))
      .subscribe(transactions => {
        this.transactions = transactions;
        this.detect();
      });
  }
}
