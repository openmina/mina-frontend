import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { NetworkSnark } from '@shared/types/network/snarks/network-snark';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkSnarks } from '@network/snarks/network-snarks.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectNetworkTransactions } from '@network/transactions/network-transactions.state';

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

  snarks: NetworkSnark[];
  activeRow: NetworkSnark;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToSnarksChanges();
  }

  private listenToSnarksChanges(): void {
    this.store.select(selectNetworkTransactions)
      .pipe(untilDestroyed(this))
      .subscribe((snarks: NetworkSnark[]) => {
        this.snarks = snarks;
        this.detect();
      });
  }

  onRowClick(snark: NetworkSnark): void {

  }

}
