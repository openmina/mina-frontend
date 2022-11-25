import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectStressingFilters, selectStressingTransactions } from '@stressing/stressing.state';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';
import { STRESSING_TOGGLE_FILTER_TRANSACTIONS, StressingToggleFilterTransactions } from '@stressing/stressing.actions';

@UntilDestroy()
@Component({
  selector: 'mina-stressing-transactions',
  templateUrl: './stressing-transactions.component.html',
  styleUrls: ['./stressing-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class StressingTransactionsComponent extends ManualDetection implements OnInit {

  readonly allFilters: any[] = [
    { name: 'Stressing Transaction', value: true },
    { name: 'Not Stressing Transaction', value: false },
  ];
  activeFilters: boolean[] = [];
  transactions: StressingTransaction[] = [];

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToTransactionChanges();
    this.listenToFiltersChanges();
  }

  private listenToTransactionChanges(): void {
    this.store.select(selectStressingTransactions)
      .pipe(untilDestroyed(this))
      .subscribe(transactions => {
        this.transactions = transactions;
        this.detect();
      });
  }

  private listenToFiltersChanges(): void {
    this.store.select(selectStressingFilters)
      .pipe(untilDestroyed(this))
      .subscribe(activeFilters => {
        this.activeFilters = activeFilters;
        this.detect();
      });
  }

  toggleFilter(payload: boolean): void {
    this.store.dispatch<StressingToggleFilterTransactions>({ type: STRESSING_TOGGLE_FILTER_TRANSACTIONS, payload });
  }
}
