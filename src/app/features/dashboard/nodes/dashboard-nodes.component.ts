import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { DashboardNodesTableComponent } from '@dashboard/nodes/dashboard-nodes-table/dashboard-nodes-table.component';
import {
  DASHBOARD_NODES_CLOSE,
  DASHBOARD_NODES_GET_EARLIEST_BLOCK, DASHBOARD_NODES_GET_NODES, DASHBOARD_NODES_INIT,
  DASHBOARD_NODES_SET_ACTIVE_BLOCK,
  DashboardNodesClose,
  DashboardNodesGetEarliestBlock, DashboardNodesGetNodes, DashboardNodesInit,
  DashboardNodesSetActiveBlock,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { selectDashboardNodesActiveNode } from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { filter, merge, take, throttleTime, timer } from 'rxjs';
import { MergedRoute } from '@shared/router/merged-route';
import { selectAppNodeStatus } from '@app/app.state';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';

@UntilDestroy()
@Component({
  selector: 'mina-dashboard-nodes',
  templateUrl: './dashboard-nodes.component.html',
  styleUrls: ['./dashboard-nodes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNodesComponent extends ManualDetection implements OnInit, OnDestroy {

  isActiveTrace: boolean;

  private blockHeight: number;
  private removedClass: boolean;

  @ViewChild(DashboardNodesTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.store.dispatch<DashboardNodesGetNodes>({ type: DASHBOARD_NODES_GET_NODES });
    this.listenToRouteChange();
    this.listenToActiveRowChange();
    this.listenToActiveBlockChangeFromNode();
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectDashboardNodesActiveNode)
      .pipe(untilDestroyed(this))
      .subscribe((row: DashboardNode) => {
        if (row && !this.isActiveTrace) {
          this.isActiveTrace = true;
          if (!this.removedClass) {
            this.removedClass = true;
            this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
          }
          this.detect();
        } else if (!row && this.isActiveTrace) {
          this.isActiveTrace = false;
          this.detect();
        }
      });
  }

  private listenToRouteChange(): void {
    // this.store.select(getMergedRoute)
    //   .pipe(
    //     untilDestroyed(this),
    //     take(1),
    //     filter(route => route.params['height']),
    //   )
    //   .subscribe((route: MergedRoute) => {
    //     this.blockHeight = Number(route.params['height']);
    //     this.store.dispatch<DashboardNodesSetActiveBlock>({
    //       type: DASHBOARD_NODES_SET_ACTIVE_BLOCK,
    //       payload: { height: this.blockHeight },
    //     });
    //   });
  }

  private listenToActiveBlockChangeFromNode(): void {
    // merge(
    //   this.store.select(selectAppNodeStatus)
    //     .pipe(
    //       untilDestroyed(this),
    //       filter(Boolean),
    //       filter((node: NodeStatus) => node.status !== AppNodeStatusTypes.CONNECTING),
    //     ),
    //   timer(0, 10000),
    // )
    //   .pipe(untilDestroyed(this), throttleTime(1000))
    //   .subscribe(() => {
    //     this.store.dispatch<DashboardNodesGetEarliestBlock>({ type: DASHBOARD_NODES_GET_EARLIEST_BLOCK });
    //   });
  }

  ngOnDestroy(): void {
    this.store.dispatch<DashboardNodesClose>({ type: DASHBOARD_NODES_CLOSE });
  }
}
