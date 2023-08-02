import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { Router } from '@angular/router';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { filter, take } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { DswWorkPoolSetActiveWorkPool, DswWorkPoolSortWorkPool } from '@dsw/work-pool/dsw-work-pool.actions';
import { selectDswWorkPoolActiveWorkPool, selectDswWorkPools, selectDswWorkPoolSort } from '@dsw/work-pool/dsw-work-pool.state';

@Component({
  selector: 'mina-dsw-work-pool-table',
  templateUrl: './dsw-work-pool-table.component.html',
  styleUrls: ['./dsw-work-pool-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswWorkPoolTableComponent extends MinaTableWrapper<WorkPool> implements OnInit {

  protected readonly tableHeads: TableColumnList<WorkPool> = [
    { name: 'datetime', sort: 'timestamp' },
    { name: 'id' },
    { name: 'types', sort: 'typesSort' },
  ];

  private wpFromRoute: string;

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToRouteChange();
    this.listenToNodesChanges();
    this.listenToActiveNodeChange();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [165, 140, 200];
    this.table.propertyForActiveCheck = 'id';
    this.table.sortClz = DswWorkPoolSortWorkPool;
    this.table.sortSelector = selectDswWorkPoolSort;
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['id'] && this.table.rows.length === 0) {
        this.wpFromRoute = route.params['id'];
      }
    }, take(1));
  }

  private listenToNodesChanges(): void {
    this.select(selectDswWorkPools, (wp: WorkPool[]) => {
      this.table.rows = wp;
      this.table.detect();
      if (this.wpFromRoute) {
        this.scrollToElement();
      }
      this.detect();
    }, filter(wp => wp.length > 0));
  }

  private listenToActiveNodeChange(): void {
    this.select(selectDswWorkPoolActiveWorkPool, (activeWp: WorkPool) => {
      this.table.activeRow = activeWp;
      this.table.detect();
      this.detect();
    });
  }

  private scrollToElement(): void {
    const finder = (node: WorkPool) => node.id === this.wpFromRoute;
    const i = this.table.rows.findIndex(finder);
    this.table.scrollToElement(finder);
    delete this.wpFromRoute;
    this.onRowClick(this.table.rows[i]);
  }

  protected override onRowClick(row: WorkPool): void {
    if (this.table.activeRow?.id !== row?.id) {
      this.dispatch(DswWorkPoolSetActiveWorkPool, { id: row.id });
      this.router.navigate([Routes.SNARK_WORKER, Routes.WORK_POOL, row.id], { queryParamsHandling: 'merge' });
    }
  }
}
