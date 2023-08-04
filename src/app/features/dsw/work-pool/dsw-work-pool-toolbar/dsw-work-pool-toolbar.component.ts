import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswWorkPoolFilters, selectDswWorkPools } from '@dsw/work-pool/dsw-work-pool.state';
import { DswWorkPoolToggleFilter } from '@dsw/work-pool/dsw-work-pool.actions';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';

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
  total: number;
  available: number;
  committed: number;
  snarked: number;

  ngOnInit(): void {
    this.listenToActiveFiltersChanges();
    this.listenToWorkPool();
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

  private listenToWorkPool(): void {
    this.select(selectDswWorkPools, (wp: WorkPool[]) => {
      this.total = wp.length;
      this.committed = wp.filter((w: WorkPool) => w.commitment).length;
      this.snarked = wp.filter((w: WorkPool) => w.snark).length;
      this.available = this.total - this.committed - this.snarked;
      this.detect();
    });

  }
}
