import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { untilDestroyed } from '@ngneat/until-destroy';
import { DashboardNodesTableComponent } from '@dashboard/nodes/dashboard-nodes-table/dashboard-nodes-table.component';
import {
  DashboardNodesClose,
  DashboardNodesGetEarliestBlock,
  DashboardNodesInit,
  DashboardNodesSetActiveBlock,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { selectDashboardNodes, selectDashboardNodesActiveNode } from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { filter, merge, take, tap, throttleTime, timer } from 'rxjs';
import { MergedRoute } from '@shared/router/merged-route';
import { selectAppNodeStatus } from '@app/app.state';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-dashboard-nodes',
  templateUrl: './dashboard-nodes.component.html',
  styleUrls: ['./dashboard-nodes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNodesComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveTrace: boolean;

  private blockHeight: number;

  ngOnInit(): void {
    this.dispatch(DashboardNodesInit);
    this.listenToRouteChange();
    this.listenToActiveRowChange();
    this.listenToActiveBlockChangeFromNode();
  }

  private listenToActiveRowChange(): void {
    this.select(selectDashboardNodesActiveNode, (row: DashboardNode) => {
      if (row && !this.isActiveTrace) {
        this.isActiveTrace = true;
        this.detect();
      } else if (!row && this.isActiveTrace) {
        this.isActiveTrace = false;
        this.detect();
      }
    });
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      this.blockHeight = Number(route.params['height']);
      this.dispatch(DashboardNodesSetActiveBlock, { height: this.blockHeight });
    }, take(1), filter(route => route.params['height']));
  }

  private listenToActiveBlockChangeFromNode(): void {
    merge(
      this.store.select(selectDashboardNodes)
        .pipe(
          untilDestroyed(this),
          filter((nodes) => nodes.length && nodes.some(n => n.status !== AppNodeStatusTypes.CONNECTING)),
        ),
      // timer(0, 20000),
    )
      .pipe(untilDestroyed(this), throttleTime(5000))
      .subscribe(() => {
        this.dispatch(DashboardNodesGetEarliestBlock);
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(DashboardNodesClose);
  }
}
