import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { DswBootstrapNode } from '@shared/types/dsw/bootstrap/dsw-bootstrap-node.type';
import { selectDswBootstrapNodes } from '@dsw/bootstrap/dsw-bootstrap.state';
import { BarGraphComponent } from '@shared/components/bar-graph/bar-graph.component';
import { filter } from 'rxjs';

@Component({
  selector: 'mina-dsw-bootstrap-overview',
  templateUrl: './dsw-bootstrap-overview.component.html',
  styleUrls: ['./dsw-bootstrap-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-minus-xl' },
})
export class DswBootstrapOverviewComponent extends StoreDispatcher implements OnInit {

  nodes: DswBootstrapNode[];
  fetchedBlocksTotal: number = 0;
  fetchedBlocksAvg: number = 0;
  fetchedBlocksMax: number = 0;
  fetchedBlocksMin: number = 0;
  appliedBlocksTotal: number = 0;
  appliedBlocksAvg: number = 0;
  appliedBlocksMax: number = 0;
  appliedBlocksMin: number = 0;

  @ViewChild('minaBarGraph1', { read: ViewContainerRef }) private minaBarGraphRef1: ViewContainerRef;
  private component1: BarGraphComponent;
  @ViewChild('minaBarGraph2', { read: ViewContainerRef }) private minaBarGraphRef2: ViewContainerRef;
  private component2: BarGraphComponent;

  async ngOnInit(): Promise<void> {
    await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.component1 = this.minaBarGraphRef1.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.component1.xStep = 0.01;
      this.component1.xTicksLength = 40;
      this.component1.yTicksLength = 6;
      this.component1.um = 's';
      this.component1.yAxisLabel = 'Count';
      this.component1.decimals = 2;
      this.component1.responsive = false;
      this.component1.xTicksSkipper = 5;
      this.component1.color = 'var(--special-selected-alt-3-primary)';
      this.component1.ngOnInit();
    });
    await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.component2 = this.minaBarGraphRef2.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.component2.xStep = 0.01;
      this.component2.xTicksLength = 40;
      this.component2.yTicksLength = 6;
      this.component2.um = 's';
      this.component2.yAxisLabel = 'Count';
      this.component2.decimals = 2;
      this.component2.responsive = false;
      this.component2.xTicksSkipper = 5;
      this.component2.color = 'var(--special-selected-alt-1-primary)';
      this.component2.ngOnInit();
    });
    this.listenToNodes();
  }

  private listenToNodes(): void {
    this.select(selectDswBootstrapNodes, (nodes: DswBootstrapNode[]) => {
      this.nodes = nodes;
      this.fetchedBlocksTotal = nodes.reduce((acc, n) => acc + n.fetchedBlocks, 0);
      this.fetchedBlocksAvg = nodes.reduce((acc, n) => acc + n.fetchedBlocksAvg, 0) / nodes.length;
      this.fetchedBlocksMax = nodes.reduce((acc, n) => acc > n.fetchedBlocksMax ? acc : n.fetchedBlocksMax, 0);
      this.fetchedBlocksMin = nodes.reduce((acc, n) => acc < n.fetchedBlocksMin ? acc : n.fetchedBlocksMin, 0);
      this.appliedBlocksTotal = nodes.reduce((acc, n) => acc + n.appliedBlocks, 0);
      this.appliedBlocksAvg = nodes.reduce((acc, n) => acc + n.appliedBlocksAvg, 0) / nodes.length;
      this.appliedBlocksMax = nodes.reduce((acc, n) => acc > n.appliedBlocksMax ? acc : n.appliedBlocksMax, 0);
      this.appliedBlocksMin = nodes.reduce((acc, n) => acc < n.appliedBlocksMin ? acc : n.appliedBlocksMin, 0);
      this.component1.values = nodes.map(n => n.fetchedBlocksAvg).filter(Boolean);
      this.component1.update();
      this.component1.detect();
      this.component2.values = nodes.map(n => n.appliedBlocksAvg).filter(Boolean);
      this.component2.update();
      this.component2.detect();
      this.detect();
    }, filter(nodes => nodes.length > 0));
  }
}
