import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectNetworkTransactions } from '@network/transactions/network-transactions.state';
import { NetworkTransaction } from '@shared/types/network/transactions/network-transaction';

@UntilDestroy()
@Component({
  selector: 'mina-network-transactions-table',
  templateUrl: './network-transactions-table.component.html',
  styleUrls: ['./network-transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class NetworkTransactionsTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 32;

  snarks: NetworkTransaction[];
  activeRow: NetworkTransaction;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToSnarksChanges();
  }

  private listenToSnarksChanges(): void {
    this.store.select(selectNetworkTransactions)
      .pipe(untilDestroyed(this))
      .subscribe((snarks: NetworkTransaction[]) => {
        this.snarks = snarks;
        this.detect();
      });
  }

  onRowClick(snark: NetworkTransaction): void {

  }

}
