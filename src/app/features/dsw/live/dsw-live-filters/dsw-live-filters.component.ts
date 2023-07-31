import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswLiveFilters } from '@dsw/live/dsw-live.state';
import { DswLiveToggleFilter } from '@dsw/live/dsw-live.actions';
import { DswDashboardNodeBlockStatus } from '@shared/types/dsw/dashboard/dsw-dashboard-block.type';

@Component({
  selector: 'mina-dsw-live-filters',
  templateUrl: './dsw-live-filters.component.html',
  styleUrls: ['./dsw-live-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-lg fx-row-vert-cent pl-12 border-bottom' },
})
export class DswLiveFiltersComponent extends StoreDispatcher implements OnInit {

  readonly allFilters: string[] = [
    'best tip',
    DswDashboardNodeBlockStatus.FETCHING,
    DswDashboardNodeBlockStatus.FETCHED,
    DswDashboardNodeBlockStatus.APPLYING,
    DswDashboardNodeBlockStatus.APPLIED,
  ];
  activeFilters: string[] = [];

  ngOnInit(): void {
    this.listenToActiveFiltersChanges();
  }

  private listenToActiveFiltersChanges(): void {
    this.select(selectDswLiveFilters, (filters: string[]) => {
      this.activeFilters = filters;
      this.detect();
    });
  }

  toggleFilter(filter: string): void {
    this.dispatch(DswLiveToggleFilter, filter);
  }
}
