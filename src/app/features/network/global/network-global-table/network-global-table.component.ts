import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { NetworkSnark } from '@shared/types/network/snarks/network-snark';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectNetworkGlobalMessages } from '@network/global/network-global.state';

@UntilDestroy()
@Component({
  selector: 'mina-network-global-table',
  templateUrl: './network-global-table.component.html',
  styleUrls: ['./network-global-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class NetworkGlobalTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 32;

  messages: NetworkSnark[];
  activeRow: NetworkSnark;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToGlobalMessagesChanges();
  }

  private listenToGlobalMessagesChanges(): void {
    this.store.select(selectNetworkGlobalMessages)
      .pipe(untilDestroyed(this))
      .subscribe((messages: NetworkSnark[]) => {
        this.messages = messages;
        this.detect();
      });
  }

  onRowClick(message: NetworkSnark): void {

  }
}
