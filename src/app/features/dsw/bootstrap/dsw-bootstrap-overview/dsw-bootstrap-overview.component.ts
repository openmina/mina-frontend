import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { DswBootstrapNode } from '@shared/types/dsw/bootstrap/dsw-bootstrap-node.type';
import { Router } from '@angular/router';
import { selectDswBootstrapNodes } from '@dsw/bootstrap/dsw-bootstrap.state';
import { BarGraphComponent } from '@shared/components/bar-graph/bar-graph.component';
import { ONE_MILLION } from '@shared/constants/unit-measurements';

@Component({
  selector: 'mina-dsw-bootstrap-overview',
  templateUrl: './dsw-bootstrap-overview.component.html',
  styleUrls: ['./dsw-bootstrap-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class DswBootstrapOverviewComponent extends StoreDispatcher implements OnInit {

  nodes: DswBootstrapNode[];

  @ViewChild('minaBarGraph1', { read: ViewContainerRef }) private minaBarGraphRef1: ViewContainerRef;
  private component1: BarGraphComponent;

  constructor(private router: Router) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.component1 = this.minaBarGraphRef1.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.component1.xStep = 0.1;
      this.component1.xTicksLength = 15;
      this.component1.yTicksLength = 6;
      this.component1.um = 's';
      this.component1.yAxisLabel = 'Count';
      this.component1.decimals = 2;
      this.component1.responsive = false;
      this.component1.ngOnInit();
    });
    this.listenToNodes();
  }

  private listenToNodes(): void {
    this.select(selectDswBootstrapNodes, (nodes: DswBootstrapNode[]) => {
      this.nodes = nodes;
      this.component1.values = nodes.map(n => n.fetchedBlocksAvg * ONE_MILLION);
      console.log(this.component1.values);
      this.component1.update();
      this.component1.detect();
      this.detect();
    });
  }
}
