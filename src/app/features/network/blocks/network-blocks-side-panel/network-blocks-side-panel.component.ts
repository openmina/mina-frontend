import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { NETWORK_BLOCKS_TOGGLE_SIDE_PANEL, NetworkBlocksToggleSidePanel } from '@network/blocks/network-blocks.actions';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectNetworkBlocks } from '@network/blocks/network-blocks.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks-side-panel',
  templateUrl: './network-blocks-side-panel.component.html',
  styleUrls: ['./network-blocks-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column border-left' },
})
export class NetworkBlocksSidePanelComponent extends ManualDetection implements OnInit {

  readonly secConfig: SecDurationConfig = { onlySeconds: true, undefinedAlternative: '-', color: true, red: 30, orange: 5 };

  firstSentTime: number;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToBlocks();
  }

  toggleSidePanel(): void {
    this.store.dispatch<NetworkBlocksToggleSidePanel>({ type: NETWORK_BLOCKS_TOGGLE_SIDE_PANEL });
  }

  private listenToBlocks(): void {
    this.store.select(selectNetworkBlocks)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: NetworkBlock[]) => {
        const values = blocks.map(b => b.sentLatency).filter(Boolean);
        this.firstSentTime = values.length ? Math.min(...values) : undefined;
        this.detect();
      });
  }
}
