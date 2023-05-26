import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectNetworkBlocksIpc } from '@network/blocks-ipc/network-blocks-ipc.state';
import { NetworkBlockIpc } from '@shared/types/network/blocks-ipc/network-block-ipc.type';
import { BarGraphComponent } from '@shared/components/bar-graph/bar-graph.component';
import { NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL, NetworkBlocksIpcToggleSidePanel } from '@network/blocks-ipc/network-blocks-ipc.actions';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks-ipc-side-panel',
  templateUrl: './network-blocks-ipc-side-panel.component.html',
  styleUrls: ['./network-blocks-ipc-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column border-left' },
})
export class NetworkBlocksIpcSidePanelComponent extends ManualDetection implements OnInit {

  @ViewChild('minaBarGraph', { read: ViewContainerRef })
  private minaBarGraphRef: ViewContainerRef;
  private component: BarGraphComponent;
  private bars: number[] = [];

  constructor(private store: Store<MinaState>) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.component = this.minaBarGraphRef.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.component.xStep = 1;
      this.component.xTicksLength = 15;
      this.component.yTicksLength = 6;
      this.component.um = 's';
      this.component.yAxisLabel = 'Count';
      this.component.decimals = 0;
      this.component.responsive = false;
      this.component.ngOnInit();
    });
    this.listenToNetworkBlocks();
  }

  private listenToNetworkBlocks(): void {
    this.store.select(selectNetworkBlocksIpc)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: NetworkBlockIpc[]) => {
        this.bars = blocks.map(b => b.blockLatency);
        this.component.values = this.bars;
        this.component.update();
        this.component.detect();
        this.detect();
      });
  }

  toggleSidePanel(): void {
    this.store.dispatch<NetworkBlocksIpcToggleSidePanel>({ type: NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL });
  }
}

