import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  DashboardNodesGetForks,
  DashboardNodesSetActiveBlock,
  DashboardNodesToggleFilter,
  DashboardNodesToggleLatency,
  DashboardNodesToggleNodesShowing,
} from '@dashboard/nodes/dashboard-nodes.actions';
import {
  selectDashboardNodesActiveBlockLevel,
  selectDashboardNodesActiveFilters,
  selectDashboardNodesActiveForkFilter,
  selectDashboardNodesAllFilters,
  selectDashboardNodesEarliestBlockLevel,
  selectDashboardNodesForks,
  selectDashboardNodesLatencyFromFastest,
  selectDashboardNodesNodeCount,
  selectDashboardNodesRemainingRequests,
  selectDashboardNodesShowOfflineNodes,
} from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNodeCount } from '@shared/types/dashboard/node-list/dashboard-node-count.type';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { LoadingService } from '@core/services/loading.service';
import { Routes } from '@shared/enums/routes.enum';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { DashboardForkFilter } from '@shared/types/dashboard/node-list/dashboard-fork-filter.type';

@UntilDestroy()
@Component({
  selector: 'mina-dashboard-nodes-toolbar',
  templateUrl: './dashboard-nodes-toolbar.component.html',
  styleUrls: ['./dashboard-nodes-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column border-bottom' },
})
export class DashboardNodesToolbarComponent extends StoreDispatcher implements OnInit, OnDestroy {

  count: DashboardNodeCount = {} as DashboardNodeCount;
  activeFilters: string[] = [];
  allFilters: string[] = [];
  activeBlock: number;
  earliestBlock: number;
  showOffline: boolean = true;
  latencyFromFastest: boolean = true;
  isLoading: boolean = true;
  forks: DashboardForkFilter[];
  activeForkFilter: { value: string, type: 'branch' | 'bestTip' };

  private urlRemoved: boolean;

  constructor(private loadingService: LoadingService,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToNode();
    this.listenToFiltersChanges();
    this.listenToActiveBlockChanges();
  }

  private listenToNode(): void {
    this.select(selectDashboardNodesShowOfflineNodes, (show: boolean) => {
      this.showOffline = show;
      this.detect();
    });
    this.select(selectDashboardNodesRemainingRequests, (remaining: number) => {
      this.urlRemoved = remaining === 0;
      if (this.isLoading && remaining === 0) {
        this.isLoading = false;
        this.dispatch(DashboardNodesGetForks);
        this.detect();
      } else if (!this.isLoading && remaining > 0) {
        this.isLoading = true;
        this.detect();
      }
    });
    this.select(selectDashboardNodesLatencyFromFastest, (latencyFromFastest: boolean) => {
      this.latencyFromFastest = latencyFromFastest;
      this.detect();
    });
    this.select(selectDashboardNodesNodeCount, (count: DashboardNodeCount) => {
      this.count = count;
      this.detect();
    });
    this.select(selectDashboardNodesForks, (forks: DashboardForkFilter[]) => {
      this.forks = forks;
      this.detect();
    });
  }

  toggleNodesShowing(): void {
    this.dispatch(DashboardNodesToggleNodesShowing);
  }

  toggleShowLatencyFromFastest(): void {
    this.dispatch(DashboardNodesToggleLatency);
  }

  private listenToFiltersChanges(): void {
    this.select(selectDashboardNodesAllFilters, (filters: string[]) => {
      this.allFilters = filters;
      this.detect();
    });
    this.select(selectDashboardNodesActiveFilters, (filters: string[]) => {
      this.activeFilters = filters;
      this.detect();
    });
    this.select(selectDashboardNodesActiveForkFilter, (filter) => {
      this.activeForkFilter = filter;
      this.detect();
    });
  }

  private listenToActiveBlockChanges(): void {
    this.select(selectDashboardNodesActiveBlockLevel, (block: number) => {
      this.activeBlock = block;
      this.detect();
    });

    this.select(selectDashboardNodesEarliestBlockLevel, (earliestBlock: number) => {
      this.earliestBlock = earliestBlock;
      this.detect();
    }, filter(Boolean), filter(earliestBlock => this.earliestBlock !== earliestBlock));
  }

  toggleFilter(filter: { value: string, type: 'branch' | 'bestTip' }): void {
    this.dispatch(DashboardNodesToggleFilter, filter);
  }

  getBlock(height: number): void {
    this.dispatch(DashboardNodesSetActiveBlock, { height, fetchNew: true });
    this.router.navigate([Routes.DASHBOARD, Routes.NODES, height], { queryParamsHandling: 'merge' });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (!this.urlRemoved) {
      this.loadingService.removeURL();
    }
  }
}
