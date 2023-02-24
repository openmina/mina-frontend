import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  DASHBOARD_NODES_SET_ACTIVE_BLOCK,
  DASHBOARD_NODES_TOGGLE_FILTER,
  DASHBOARD_NODES_TOGGLE_LATENCY,
  DASHBOARD_NODES_TOGGLE_NODES_SHOWING,
  DashboardNodesSetActiveBlock,
  DashboardNodesToggleFilter,
  DashboardNodesToggleLatency,
  DashboardNodesToggleNodesShowing,
} from '@dashboard/nodes/dashboard-nodes.actions';
import {
  selectDashboardNodes,
  selectDashboardNodesActiveBlockLevel,
  selectDashboardNodesActiveFilters,
  selectDashboardNodesAllFilters,
  selectDashboardNodesEarliestBlockLevel,
  selectDashboardNodesLatencyFromFastest,
  selectDashboardNodesNodeCount,
  selectDashboardNodesShowOfflineNodes,
} from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNodeCount } from '@shared/types/dashboard/node-list/dashboard-node-count.type';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { LoadingService } from '@core/services/loading.service';
import { Routes } from '@shared/enums/routes.enum';

@UntilDestroy()
@Component({
  selector: 'mina-dashboard-nodes-toolbar',
  templateUrl: './dashboard-nodes-toolbar.component.html',
  styleUrls: ['./dashboard-nodes-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column border-bottom' },
})
export class DashboardNodesToolbarComponent extends ManualDetection implements OnInit, OnDestroy {

  count: DashboardNodeCount = {} as DashboardNodeCount;
  activeFilters: string[] = [];
  allFilters: string[] = [];
  activeBlock: number;
  earliestBlock: number;
  showOffline: boolean = true;
  latencyFromFastest: boolean = true;
  loadingNodes: boolean = true;

  private urlRemoved: boolean;

  constructor(private store: Store<MinaState>,
              private loadingService: LoadingService,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToNode();
    this.listenToFiltersChanges();
    this.listenToActiveBlockChanges();
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
        filter(nodes => nodes.every(node => node.loaded)),
      )
      .subscribe(() => {
        this.loadingNodes = false;
        this.urlRemoved = true;
        this.detect();
      });
  }

  toggleNodesShowing(): void {
    this.store.dispatch<DashboardNodesToggleNodesShowing>({ type: DASHBOARD_NODES_TOGGLE_NODES_SHOWING });
  }

  toggleShowLatencyFromFastest(): void {
    this.store.dispatch<DashboardNodesToggleLatency>({ type: DASHBOARD_NODES_TOGGLE_LATENCY });
  }

  private listenToFiltersChanges(): void {
    this.store.select(selectDashboardNodesAllFilters)
      .pipe(untilDestroyed(this))
      .subscribe((filters: string[]) => {
        this.allFilters = filters;
        this.detect();
      });
    this.store.select(selectDashboardNodesActiveFilters)
      .pipe(untilDestroyed(this))
      .subscribe((filters: string[]) => {
        this.activeFilters = filters;
        this.detect();
      });
  }

  private listenToActiveBlockChanges(): void {
    this.store.select(selectDashboardNodesActiveBlockLevel)
      .pipe(untilDestroyed(this))
      .subscribe((block: number) => {
        this.activeBlock = block;
        this.detect();
      });

    this.store.select(selectDashboardNodesEarliestBlockLevel)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(earliestBlock => this.earliestBlock !== earliestBlock),
      )
      .subscribe((earliestBlock: number) => {
        this.earliestBlock = earliestBlock;
        this.detect();
      });
  }

  toggleFilter(filter: string): void {
    this.store.dispatch<DashboardNodesToggleFilter>({ type: DASHBOARD_NODES_TOGGLE_FILTER, payload: filter });
  }

  getBlock(height: number): void {
    this.store.dispatch<DashboardNodesSetActiveBlock>({ type: DASHBOARD_NODES_SET_ACTIVE_BLOCK, payload: { height, fetchNew: true } });
    this.router.navigate([Routes.DASHBOARD, Routes.NODES, height], { queryParamsHandling: 'merge' });
  }

  ngOnDestroy(): void {
    if (!this.urlRemoved) {
      this.loadingService.removeURL();
    }
  }
}
