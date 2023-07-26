import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
    { name: 'status', sort: 'kind' },
    { name: 'name' },
    { name: 'height', tooltip: 'The block height on which the Snarker is currently working. ' },
    { name: 'best tip', sort: 'bestTip', tooltip: 'The blockchain\'s latest block with the highest known chain strength.' },
    { name: 'datetime', sort: 'bestTipReceivedTimestamp', tooltip: 'The date when the block was received.' },
    { name: 'applied', sort: 'appliedBlocks', tooltip: 'Number of blocks that node has applied with the latest synchronization attempt.' },
    { name: 'applying', sort: 'applyingBlocks', tooltip: 'Number of blocks that node is currently applying with the latest synchronization attempt.' },
    { name: 'fetching', sort: 'fetchingBlocks', tooltip: 'Number of blocks that node is currently fetching with the latest synchronization attempt.' },
    { name: 'fetched', sort: 'fetchedBlocks', tooltip: 'Number of blocks that node has fetched with the latest synchronization attempt.' },
    { name: 'missing blocks', sort: 'missingBlocks', tooltip: 'Number of blocks that the node needs to fetch with the latest synchronization attempt.' },
  ];

  private nodeFromRoute: string;
  @ViewChild('thGroupsTemplate') private thGroupsTemplate: TemplateRef<void>;

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
    this.table.thGroupsTemplate = this.thGroupsTemplate;
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
