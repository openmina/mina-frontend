import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswWorkPoolFilters } from '@dsw/work-pool/dsw-work-pool.state';
import { DswWorkPoolToggleFilter } from '@dsw/work-pool/dsw-work-pool.actions';

@Component({
  selector: 'mina-dsw-work-pool-toolbar',
  templateUrl: './dsw-work-pool-toolbar.component.html',
  styleUrls: ['./dsw-work-pool-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'fx-row-vert-cent h-lg border-bottom' },
})
export class DswWorkPoolToolbarComponent extends StoreDispatcher implements OnInit {

  readonly allFilters: string[] = [
    'local',
    'remote',
  ];
  activeFilters: string[] = [];

  ngOnInit(): void {
    this.listenToActiveFiltersChanges();
  }

  private listenToActiveFiltersChanges(): void {
    this.select(selectDswWorkPoolFilters, (filters: string[]) => {
      this.activeFilters = filters;
      this.detect();
    });
  }

  toggleFilter(filter: string): void {
    this.dispatch(DswWorkPoolToggleFilter, filter);
  }
}
