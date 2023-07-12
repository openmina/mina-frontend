import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { Router } from '@angular/router';
import { DswDashboardSetActiveNode, DswDashboardSortNodes } from '@dsw/dashboard/dsw-dashboard.actions';
import { selectDswDashboardActiveNode, selectDswDashboardNodes, selectDswDashboardSort } from '@dsw/dashboard/dsw-dashboard.state';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { filter, take } from 'rxjs';

@Component({
  selector: 'mina-dsw-dashboard-table',
  templateUrl: './dsw-dashboard-table.component.html',
  styleUrls: ['./dsw-dashboard-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswDashboardTableComponent extends MinaTableWrapper<DswDashboardNode> implements OnInit {

  protected readonly tableHeads: TableColumnList<DswDashboardNode> = [
    { name: 'kind' },
    { name: 'name' },
    { name: 'height' },
    { name: 'best tip', sort: 'bestTip' },
    { name: 'datetime', sort: 'bestTipReceivedTimestamp' },
    { name: 'applied', sort: 'appliedBlocks' },
    { name: 'applying', sort: 'applyingBlocks' },
    { name: 'fetching', sort: 'fetchingBlocks' },
    { name: 'fetched', sort: 'fetchedBlocks' },
    { name: 'missing blocks', sort: 'missingBlocks' },
  ];

  private nodeFromRoute: string;

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToRouteChange();
    this.listenToNodesChanges();
    this.listenToActiveNodeChange();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [100, 120, 80, 130, 165, 120, 120, 120, 120, 120];
    this.table.propertyForActiveCheck = 'name';
    this.table.sortClz = DswDashboardSortNodes;
    this.table.sortSelector = selectDswDashboardSort;
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['node'] && this.table.rows.length === 0) {
        this.nodeFromRoute = route.params['node'];
      }
    }, take(1));
  }

  private listenToNodesChanges(): void {
    this.select(selectDswDashboardNodes, (nodes: DswDashboardNode[]) => {
      this.table.rows = nodes;
      this.table.detect();
      if (this.nodeFromRoute) {
        this.scrollToElement();
      }
      this.detect();
    }, filter(nodes => nodes.length > 0));
  }

  private listenToActiveNodeChange(): void {
    this.select(selectDswDashboardActiveNode, (node: DswDashboardNode) => {
      this.table.activeRow = node;
      this.table.detect();
      this.detect();
    });
  }

  private scrollToElement(): void {
    const finder = (node: DswDashboardNode) => node.name === this.nodeFromRoute;
    const i = this.table.rows.findIndex(finder);
    this.table.scrollToElement(finder);
    delete this.nodeFromRoute;
    this.onRowClick(this.table.rows[i]);
  }

  protected override onRowClick(row: DswDashboardNode): void {
    if (this.table.activeRow?.name !== row?.name) {
      this.dispatch(DswDashboardSetActiveNode, row);
      this.router.navigate([Routes.SNARK_WORKER, Routes.DASHBOARD, row.name], { queryParamsHandling: 'merge' });
    }
  }
}
