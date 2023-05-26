import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import {
  selectDashboardSplitsNetworkMergeDetails,
  selectDashboardSplitsNetworkSplitsDetails,
  selectDashboardSplitsNodeStats,
  selectDashboardSplitsSetsAndFetching,
} from '@dashboard/splits/dashboard-splits.state';
import { DashboardSplitsSet } from '@shared/types/dashboard/splits/dashboard-splits-set.type';
import { DashboardSplitsGetSplits, DashboardSplitsMergeNodes, DashboardSplitsSplitNodes } from '@dashboard/splits/dashboard-splits.actions';
import { DashboardNodeCount } from '@shared/types/dashboard/node-list/dashboard-node-count.type';
import { filter } from 'rxjs';

@Component({
  selector: 'mina-dashboard-splits-toolbar',
  templateUrl: './dashboard-splits-toolbar.component.html',
  styleUrls: ['./dashboard-splits-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-xl' },
})
export class DashboardSplitsToolbarComponent extends StoreDispatcher implements OnInit {

  setsLength: number;
  sets: DashboardSplitsSet[] = [];
  networkSplitTime: string;
  networkMergeTime: string;
  stats: DashboardNodeCount;
  fetching: boolean;

  ngOnInit(): void {
    this.listenToSetsChanges();
    this.listenToSplitTimeChanges();
    this.listenToMergeTimeChanges();
    this.listenToNodeStatsChanges();
  }

  private listenToSetsChanges(): void {
    this.select(selectDashboardSplitsSetsAndFetching, ({ sets, fetching }: { sets: DashboardSplitsSet[], fetching: boolean }) => {
      this.setsLength = sets.length;
      this.sets = sets;
      this.fetching = fetching;
      this.detect();
    }, filter(({ sets }) => sets.length > 0));
  }

  private listenToSplitTimeChanges(): void {
    this.select(selectDashboardSplitsNetworkSplitsDetails, (time: string) => {
      this.networkSplitTime = time;
      this.detect();
    });
  }

  private listenToMergeTimeChanges(): void {
    this.select(selectDashboardSplitsNetworkMergeDetails, (time: string) => {
      this.networkMergeTime = time;
      this.detect();
    });
  }

  private listenToNodeStatsChanges(): void {
    this.select(selectDashboardSplitsNodeStats, (stats: DashboardNodeCount) => {
      this.stats = stats;
      this.detect();
    });
  }

  splitNodes(): void {
    this.dispatch(DashboardSplitsSplitNodes);
  }

  refresh(): void {
    this.dispatch(DashboardSplitsGetSplits);
  }

  mergeNodes(): void {
    this.dispatch(DashboardSplitsMergeNodes);
  }
}
