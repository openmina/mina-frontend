import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from '@ngneat/until-destroy';
import {
  DashboardNodesClose,
  DashboardNodesGetEarliestBlock,
  DashboardNodesGetNodesSuccess,
  DashboardNodesInit,
  DashboardNodesSetActiveBlock,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { selectDashboardNodes, selectDashboardNodesActiveNode, selectDashboardNodesRemainingRequests } from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNode } from '@shared/types/dashboard/nodes/dashboard-node.type';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { filter, merge, take, throttleTime } from 'rxjs';
import { MergedRoute } from '@shared/router/merged-route';
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
    this.listenToRemainingNodesToFetch();
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

  private listenToRemainingNodesToFetch(): void {
    this.select(selectDashboardNodesRemainingRequests, (remaining: number) => {
      if (remaining === 0) {
        this.dispatch(DashboardNodesGetNodesSuccess);
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(DashboardNodesClose);
  }
}
