import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BlockStructuredTraceComponent } from '@shared/components/block-structured-trace/block-structured-trace.component';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { selectDashboardNodesActiveNode, selectDashboardNodesBlockTraces } from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNodesSetActiveNode } from '@dashboard/nodes/dashboard-nodes.actions';
import { filter } from 'rxjs';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-dashboard-nodes-side-panel',
  templateUrl: './dashboard-nodes-side-panel.component.html',
  styleUrls: ['./dashboard-nodes-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class DashboardNodesSidePanelComponent extends StoreDispatcher implements OnInit {

  title: string;

  @ViewChild('traces', { read: ViewContainerRef })
  private blockStructuredTrace: ViewContainerRef;
  private component: BlockStructuredTraceComponent;

  async ngOnInit(): Promise<void> {
    await import('@shared/components/block-structured-trace/block-structured-trace.component').then(c => {
      this.component = this.blockStructuredTrace.createComponent<BlockStructuredTraceComponent>(c.BlockStructuredTraceComponent).instance;
    });
    this.listenToActiveTraceChange();
  }

  private listenToActiveTraceChange(): void {
    this.select(selectDashboardNodesActiveNode, (activeNode: DashboardNode) => {
      this.title = `${activeNode.source} Transition ${activeNode.blockchainLength} - ${activeNode.traceStatus}`;
      this.component.detect();
      this.detect();
    }, filter(Boolean));
    this.select(selectDashboardNodesBlockTraces, (groups: TracingTraceGroup[]) => {
      this.component.checkpoints = groups[0]?.checkpoints;
      if (this.component.allExpanded) {
        this.component.expandAll();
      }
      this.component.detect();
    });
  }

  closeSidePanel(): void {
    this.dispatch(DashboardNodesSetActiveNode);
  }
}
