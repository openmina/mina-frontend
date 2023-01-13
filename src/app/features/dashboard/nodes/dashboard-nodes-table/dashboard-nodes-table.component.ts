import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { DashboardNode } from '@app/shared/types/dashboard/node-list/dashboard-node.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectDashboardNodes, selectDashboardNodesActiveNode, selectDashboardNodesSorting } from '@dashboard/nodes/dashboard-nodes.state';
import {
  DASHBOARD_NODES_SET_ACTIVE_NODE,
  DASHBOARD_NODES_SORT,
  DashboardNodesSetActiveNode,
  DashboardNodesSort,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mina-dashboard-nodes-table',
  templateUrl: './dashboard-nodes-table.component.html',
  styleUrls: ['./dashboard-nodes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class DashboardNodesTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;
  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<DashboardNode>[] = [
    { name: 'name' },
    { name: 'status' },
    { name: 'hash' },
    { name: 'height', sort: 'blockchainLength' },
    { name: 'address', sort: 'addr' },
    { name: 'datetime', sort: 'timestamp' },
    { name: 'latency' },
    { name: 'block application', sort: 'blockApplication' },
    { name: 'source' },
    { name: 'tx. pool', sort: 'txPool' },
    { name: 'snark pool', sort: 'snarkPool' },
  ];

  nodes: DashboardNode[] = [];
  currentSort: TableSort<DashboardNode>;
  activeNode: DashboardNode;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToSortingChanges();
    this.listenToNodeList();
    this.listenToActiveDashboardNodeChange();
  }

  private listenToNodeList(): void {
    this.store.select(selectDashboardNodes)
      .pipe(untilDestroyed(this))
      .subscribe((nodes: DashboardNode[]) => {
        this.nodes = nodes;
        this.detect();
      });
  }

  private listenToSortingChanges(): void {
    this.store.select(selectDashboardNodesSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.detect();
      });
  }

  private listenToActiveDashboardNodeChange(): void {
    this.store.select(selectDashboardNodesActiveNode)
      .pipe(
        untilDestroyed(this),
        filter(node => node !== this.activeNode),
      )
      .subscribe((node: DashboardNode) => {
        this.activeNode = node;
        this.detect();
      });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<DashboardNodesSort>({
      type: DASHBOARD_NODES_SORT,
      payload: { sortBy: sortBy as keyof DashboardNode, sortDirection },
    });
  }

  onRowClick(node: DashboardNode): void {
    if (this.activeNode?.index !== node.index && node.hash) {
      this.activeNode = node;
      this.store.dispatch<DashboardNodesSetActiveNode>({ type: DASHBOARD_NODES_SET_ACTIVE_NODE, payload: node });
    }
  }

}
