import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectNetworkSnarks } from '@network/snarks/network-snarks.state';
import { NetworkSnark } from '@shared/types/network/snarks/network-snark';

@UntilDestroy()
@Component({
  selector: 'mina-network-snarks-table',
  templateUrl: './network-snarks-table.component.html',
  styleUrls: ['./network-snarks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class NetworkSnarksTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 32;

  snarks: NetworkSnark[];
  activeRow: NetworkSnark;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToSnarksChanges();
  }

  private listenToSnarksChanges(): void {
    this.store.select(selectNetworkSnarks)
      .pipe(untilDestroyed(this))
      .subscribe((snarks: NetworkSnark[]) => {
        this.snarks = snarks;
        this.detect();
      });
  }

  onRowClick(snark: NetworkSnark): void {

  }
}
