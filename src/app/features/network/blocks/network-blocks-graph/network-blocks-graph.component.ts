import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkBlocks } from '@network/blocks/network-blocks.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { BarGraphComponent } from '@shared/components/bar-graph/bar-graph.component';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks-graph',
  templateUrl: './network-blocks-graph.component.html',
  styleUrls: ['./network-blocks-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkBlocksGraphComponent extends ManualDetection implements OnInit {

  bars: number[] = [];

  @ViewChild('minaBarGraph', { read: ViewContainerRef })
  private minaBarGraphRef: ViewContainerRef;
  private component: BarGraphComponent;

  constructor(private store: Store<MinaState>) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.component = this.minaBarGraphRef.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.component.columnStep = 0.2;
      this.component.xTicksLength = 20;
      this.component.um = 's';
      this.component.yAxisLabel = 'Count';
      this.component.ngOnInit();
    });
    this.listenToNetworkBlocks();
  }

  private listenToNetworkBlocks(): void {
    this.store.select(selectNetworkBlocks)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: NetworkBlock[]) => {
        this.bars = blocks.filter(b => b.receivedLatency || b.sentLatency).map(b => b.receivedLatency || b.sentLatency);
        this.component.values = this.bars;
        this.component.update();
        this.component.detect();
        this.detect();
      });
  }
}

