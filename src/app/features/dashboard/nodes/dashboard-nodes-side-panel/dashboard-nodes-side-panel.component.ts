import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { BlockStructuredTraceComponent } from '@shared/components/block-structured-trace/block-structured-trace.component';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { selectDashboardNodesActiveNode, selectDashboardNodesBlockTraces } from '@dashboard/nodes/dashboard-nodes.state';
import { DASHBOARD_NODES_SET_ACTIVE_NODE, DashboardNodesSetActiveNode } from '@dashboard/nodes/dashboard-nodes.actions';
import { filter } from 'rxjs';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { TruncateMidPipe } from '@shared/pipes/truncate-mid.pipe';

@UntilDestroy()
@Component({
  selector: 'mina-dashboard-nodes-side-panel',
  templateUrl: './dashboard-nodes-side-panel.component.html',
  styleUrls: ['./dashboard-nodes-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TruncateMidPipe],
})
export class DashboardNodesSidePanelComponent extends ManualDetection implements OnInit {

  @ViewChild('traces', { read: ViewContainerRef })
  private blockStructuredTrace: ViewContainerRef;
  private component: BlockStructuredTraceComponent;

  constructor(private store: Store<MinaState>,
              private truncateMid: TruncateMidPipe) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/block-structured-trace/block-structured-trace.component').then(c => {
      this.component = this.blockStructuredTrace.createComponent<BlockStructuredTraceComponent>(c.BlockStructuredTraceComponent).instance;
      this.component.closeEmitter$.pipe(untilDestroyed(this)).subscribe(() => this.closeSidePanel());
    });
    this.listenToActiveTraceChange();
  }

  private listenToActiveTraceChange(): void {
    this.store.select(selectDashboardNodesActiveNode)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
      )
      .subscribe((activeNode: DashboardNode) => {
        this.component.title = 'Distributions - ' + this.truncateMid.transform(activeNode.hash);
        this.component.detect();
      });
    this.store.select(selectDashboardNodesBlockTraces)
      .pipe(untilDestroyed(this))
      .subscribe((groups: TracingTraceGroup[]) => {
        this.component.checkpoints = groups[0]?.checkpoints;
        if (this.component.allExpanded) {
          this.component.expandAll();
        }
        this.component.detect();
      });
  }

  closeSidePanel(): void {
    this.store.dispatch<DashboardNodesSetActiveNode>({ type: DASHBOARD_NODES_SET_ACTIVE_NODE, payload: undefined });
  }
}
