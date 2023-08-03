import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { BarGraphComponent } from '@shared/components/bar-graph/bar-graph.component';
import { selectDswWorkPools } from '@dsw/work-pool/dsw-work-pool.state';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';

@Component({
  selector: 'mina-dsw-work-pool-statistics',
  templateUrl: './dsw-work-pool-statistics.component.html',
  styleUrls: ['./dsw-work-pool-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-minus-xl' },
})
export class DswWorkPoolStatisticsComponent extends StoreDispatcher implements OnInit {

  workPools: WorkPool[];
  totalCommitments: number;
  totalSnarks: number;

  @ViewChild('minaBarGraph1', { read: ViewContainerRef }) private minaBarGraphRef1: ViewContainerRef;
  private component1: BarGraphComponent;
  @ViewChild('minaBarGraph2', { read: ViewContainerRef }) private minaBarGraphRef2: ViewContainerRef;
  private component2: BarGraphComponent;

  async ngOnInit(): Promise<void> {
    await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.component1 = this.minaBarGraphRef1.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.component1.color = 'var(--base-primary)';
      this.addBarGraphProperties(this.component1);
      this.component1.ngOnInit();
    });
    await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.component2 = this.minaBarGraphRef2.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.component2.color = 'var(--success-primary)';
      this.addBarGraphProperties(this.component2);
      this.component2.ngOnInit();
    });
    this.listenToNodes();
  }

  private addBarGraphProperties(component: BarGraphComponent): void {
    component.xStep = 50;
    component.xTicksLength = 55;
    component.yTicksLength = 6;
    component.um = 's';
    component.yAxisLabel = 'Count';
    component.decimals = 0;
    component.responsive = false;
    component.xTicksSkipper = 8;
  }

  private listenToNodes(): void {
    this.select(selectDswWorkPools, (workPools: WorkPool[]) => {
      this.workPools = workPools;
      const commitments = workPools.map(n => n.commitmentRecLatency).filter(Boolean);
      this.totalCommitments = commitments.length;
      this.component1.values = commitments;
      this.component1.update();
      this.component1.detect();
      const snarks = workPools.map(n => n.snarkRecLatency).filter(Boolean);
      this.totalSnarks = snarks.length;
      this.component2.values = snarks;
      this.component2.update();
      this.component2.detect();
      this.detect();
    });
  }
}
