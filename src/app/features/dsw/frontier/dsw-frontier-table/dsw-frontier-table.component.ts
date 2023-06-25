import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { Router } from '@angular/router';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { filter, take } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { DswFrontierLog } from '@shared/types/dsw/frontier/dsw-frontier-log.type';
import { DswFrontierSetActiveLog, DswFrontierSortLogs } from '@dsw/frontier/dsw-frontier.actions';
import { selectDswFrontierActiveLog, selectDswFrontierLogs, selectDswFrontierSort } from '@dsw/frontier/dsw-frontier.state';

@Component({
  selector: 'mina-dsw-frontier-table',
  templateUrl: './dsw-frontier-table.component.html',
  styleUrls: ['./dsw-frontier-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswFrontierTableComponent extends MinaTableWrapper<DswFrontierLog> implements OnInit {

  protected readonly tableHeads: TableColumnList<DswFrontierLog> = [
    { name: 'date' },
    { name: 'level' },
    { name: 'message' },
  ];

  private nodeFromRoute: number;

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToRouteChange();
    this.listenToNodesChanges();
    this.listenToActiveNodeChange();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [165, 150, 300];
    this.table.propertyForActiveCheck = 'id';
    this.table.sortClz = DswFrontierSortLogs;
    this.table.sortSelector = selectDswFrontierSort;
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['log'] && this.table.rows.length === 0) {
        this.nodeFromRoute = Number(route.params['log']);
      }
    }, take(1));
  }

  private listenToNodesChanges(): void {
    this.select(selectDswFrontierLogs, (logs: DswFrontierLog[]) => {
      this.table.rows = logs;
      this.table.detect();
      if (this.nodeFromRoute) {
        this.scrollToElement();
      }
      this.detect();
    }, filter(logs => logs.length > 0));
  }

  private listenToActiveNodeChange(): void {
    this.select(selectDswFrontierActiveLog, (log: DswFrontierLog) => {
      this.table.activeRow = log;
      this.table.detect();
      this.detect();
    });
  }

  private scrollToElement(): void {
    const finder = (node: DswFrontierLog) => node.id === this.nodeFromRoute;
    const i = this.table.rows.findIndex(finder);
    this.table.scrollToElement(finder);
    delete this.nodeFromRoute;
    this.onRowClick(this.table.rows[i]);
  }

  protected override onRowClick(row: DswFrontierLog): void {
    if (this.table.activeRow?.id !== row?.id) {
      this.dispatch(DswFrontierSetActiveLog, row);
      this.router.navigate([Routes.SNARK_WORKER, Routes.FRONTIER, row.id], { queryParamsHandling: 'merge' });
    }
  }
}
