import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { BenchmarksTransactionsClose, BenchmarksTransactionsGetTransactions } from '@benchmarks/transactions/benchmarks-transactions.actions';

@Component({
  selector: 'mina-benchmarks-transactions',
  templateUrl: './benchmarks-transactions.component.html',
  styleUrls: ['./benchmarks-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class BenchmarksTransactionsComponent extends StoreDispatcher implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.dispatch(BenchmarksTransactionsGetTransactions);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(BenchmarksTransactionsClose);
  }
}
