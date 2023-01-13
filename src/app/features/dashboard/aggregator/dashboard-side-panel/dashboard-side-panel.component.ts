import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { AGGREGATOR_TOGGLE_SIDE_PANEL, AggregatorToggleSidePanel } from '@dashboard/aggregator/aggregator.actions';
import { BarGraphComponent } from '@shared/components/bar-graph/bar-graph.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectAggregatorMessages } from '@dashboard/aggregator/aggregator.state';
import { DashboardMessage } from '@shared/types/dashboard/dashboard-message';

@UntilDestroy()
@Component({
  selector: 'mina-dashboard-side-panel',
  templateUrl: './dashboard-side-panel.component.html',
  styleUrls: ['./dashboard-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column border-left' },
})
export class DashboardSidePanelComponent extends ManualDetection implements OnInit {

  @ViewChild('minaBarGraph', { read: ViewContainerRef })
  private minaBarGraphRef: ViewContainerRef;
  private component: BarGraphComponent;
  private bars: number[] = [];

  constructor(private store: Store<MinaState>) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.component = this.minaBarGraphRef.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.component.xStep = 1;
      this.component.xTicksLength = 10;
      this.component.yTicksLength = 6;
      this.component.um = 's';
      this.component.yAxisLabel = 'Count';
      this.component.responsive = false;
      this.component.decimals = 0;
      this.component.ngOnInit();
    });
    this.listenToNetworkBlocks();
  }

  private listenToNetworkBlocks(): void {
    this.store.select(selectAggregatorMessages)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: DashboardMessage[]) => {
        this.bars = blocks.map(b => b.blockLatency).filter(l => l !== undefined);
        this.component.values = this.bars;
        this.component.update();
        this.component.detect();
        this.detect();
      });
  }

  toggleSidePanel(): void {
    this.store.dispatch<AggregatorToggleSidePanel>({ type: AGGREGATOR_TOGGLE_SIDE_PANEL });
  }
}
