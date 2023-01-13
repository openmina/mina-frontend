import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  DASHBOARD_NODES_GET_NODES,
  DASHBOARD_NODES_TOGGLE_LATENCY,
  DASHBOARD_NODES_TOGGLE_NODES_SHOWING, DashboardNodesGetNodes,
  DashboardNodesToggleLatency,
  DashboardNodesToggleNodesShowing,
} from '@dashboard/nodes/dashboard-nodes.actions';
import {
  selectDashboardNodes,
  selectDashboardNodesLatencyFromFastest,
  selectDashboardNodesNodeCount,
  selectDashboardNodesShowOfflineNodes,
} from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNodeCount } from '@shared/types/dashboard/node-list/dashboard-node-count.type';
import { Router } from '@angular/router';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mina-dashboard-nodes-toolbar',
  templateUrl: './dashboard-nodes-toolbar.component.html',
  styleUrls: ['./dashboard-nodes-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNodesToolbarComponent extends ManualDetection implements OnInit {

  count: DashboardNodeCount = {} as DashboardNodeCount;
  // activeFilters: string[] = [];
  // allFilters: string[] = [];
  // activeBlock: number;
  // earliestBlock: number;
  showOffline: boolean = false;
  latencyFromFastest: boolean = true;
  loadingNodes: boolean = true;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToNode();
    // this.listenToFiltersChanges();
    // this.listenToActiveBlockChanges();
  }

  private listenToNode(): void {
    this.store.select(selectDashboardNodesShowOfflineNodes)
      .pipe(untilDestroyed(this))
      .subscribe((show: boolean) => {
        this.showOffline = show;
        this.detect();
      });
    this.store.select(selectDashboardNodesLatencyFromFastest)
      .pipe(untilDestroyed(this))
      .subscribe((latencyFromFastest: boolean) => {
        this.latencyFromFastest = latencyFromFastest;
        this.detect();
      });
    this.store.select(selectDashboardNodesNodeCount)
      .pipe(untilDestroyed(this))
      .subscribe((count: DashboardNodeCount) => {
        this.count = count;
        this.detect();
      });
    this.store.select(selectDashboardNodes)
      .pipe(
        untilDestroyed(this),
        filter(nodes => nodes.length > 0),
      )
      .subscribe(() => {
        this.loadingNodes = false;
        this.detect();
      });
  }

  toggleNodesShowing(): void {
    this.store.dispatch<DashboardNodesToggleNodesShowing>({ type: DASHBOARD_NODES_TOGGLE_NODES_SHOWING });
  }

  toggleShowLatencyFromFastest(): void {
    this.store.dispatch<DashboardNodesToggleLatency>({ type: DASHBOARD_NODES_TOGGLE_LATENCY });
  }

  // private listenToFiltersChanges(): void {
  // this.store.select(selectDashboardNodesAllFilters)
  //   .pipe(untilDestroyed(this))
  //   .subscribe((filters: string[]) => {
  //     this.allFilters = filters;
  //     this.detect();
  //   });
  // this.store.select(selectDashboardNodesActiveFilters)
  //   .pipe(untilDestroyed(this))
  //   .subscribe((filters: string[]) => {
  //     this.activeFilters = filters;
  //     this.detect();
  //   });
  // }

  // private listenToActiveBlockChanges(): void {
  //   this.store.select(selectDashboardNodesActiveBlock)
  //     .pipe(untilDestroyed(this))
  //     .subscribe((block: number) => {
  //       this.activeBlock = block;
  //       this.detect();
  //     });
  //
  //   this.store.select(selectDashboardNodesEarliestBlock)
  //     .pipe(
  //       untilDestroyed(this),
  //       filter(Boolean),
  //       filter(earliestBlock => this.earliestBlock !== earliestBlock),
  //     )
  //     .subscribe((earliestBlock: number) => {
  //       this.earliestBlock = earliestBlock;
  //       this.detect();
  //     });
  // }

  // toggleFilter(filter: string): void {
  //   this.store.dispatch<DashboardNodesToggleFilter>({ type: DASHBOARD_NODES_TOGGLE_FILTER, payload: filter });
  // }
  //
  // getBlock(height: number): void {
  //   this.store.dispatch<DashboardNodesSetActiveBlock>({ type: DASHBOARD_NODES_SET_ACTIVE_BLOCK, payload: { height, fetchNew: true } });
  //   this.router.navigate([Routes.DASHBOARD, Routes.NODES, height]);
  // }
  refreshData(): void {
    if (this.loadingNodes) {
      return;
    }
    this.loadingNodes = true;
    this.store.dispatch<DashboardNodesGetNodes>({ type: DASHBOARD_NODES_GET_NODES });
  }
}
