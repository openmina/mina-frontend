import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { DashboardNode } from '@app/shared/types/dashboard/node-list/dashboard-node.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import {
  selectDashboardNodes,
  selectDashboardNodesActiveBlockLevel,
  selectDashboardNodesActiveNode,
  selectDashboardNodesEarliestBlockLevel,
  selectDashboardNodesSorting,
} from '@dashboard/nodes/dashboard-nodes.state';
import {
  DASHBOARD_NODES_SET_ACTIVE_BLOCK,
  DASHBOARD_NODES_SET_ACTIVE_NODE,
  DASHBOARD_NODES_SORT,
  DashboardNodesSetActiveBlock,
  DashboardNodesSetActiveNode,
  DashboardNodesSort,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { filter } from 'rxjs';
import { isNotVanilla } from '@shared/constants/config';
import { toggleItem } from '@shared/helpers/array.helper';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';

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
    { name: 'state hash', sort: 'hash' },
    { name: 'branch' },
    { name: 'candidate', sort: 'bestTip' },
    { name: 'height', sort: 'blockchainLength' },
    { name: 'address', sort: 'addr' },
    { name: 'datetime', sort: 'timestamp' },
    { name: 'latency' },
    { name: 'block application', sort: 'blockApplication' },
    { name: 'source' },
    { name: 'trace status', sort: 'traceStatus' },
    { name: 'tx. pool', sort: 'txPool' },
    { name: 'snark pool', sort: 'snarkPool' },
    { name: 'logs', sort: 'name' },
  ];

  nodes: DashboardNode[] = [];
  currentSort: TableSort<DashboardNode>;
  activeNode: DashboardNode;
  downloadingNodes: number[] = [];
  currentHeightIsTooBig: boolean;
  latestHeight: number;

  private activeHeight: number;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToSortingChanges();
    this.listenToNodeList();
    this.listenToActiveDashboardNodeChange();
    this.listenToLatestLevelChange();
    this.listenToActiveLevelChange();
  }

  private listenToActiveLevelChange(): void {
    this.store.select(selectDashboardNodesActiveBlockLevel)
      .pipe(untilDestroyed(this))
      .subscribe((height: number) => {
        this.activeHeight = height;
        this.toggleHeightMismatching();
      });
  }

  private listenToLatestLevelChange(): void {
    this.store.select(selectDashboardNodesEarliestBlockLevel)
      .pipe(untilDestroyed(this))
      .subscribe((height: number) => {
        this.latestHeight = height;
        this.toggleHeightMismatching();
      });
  }

  private toggleHeightMismatching(): void {
    if (this.activeHeight > this.latestHeight && !this.currentHeightIsTooBig) {
      this.currentHeightIsTooBig = true;
      this.detect();
    } else if (this.currentHeightIsTooBig) {
      if (this.activeHeight <= this.latestHeight) {
        this.currentHeightIsTooBig = false;
      }
      this.detect();
    }
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
    if (this.activeNode?.index !== node.index && node.hash && isNotVanilla()) {
      this.store.dispatch<DashboardNodesSetActiveNode>({ type: DASHBOARD_NODES_SET_ACTIVE_NODE, payload: { node } });
    }
  }

  downloadLogs(node: DashboardNode, index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.downloadingNodes = toggleItem(this.downloadingNodes, index);
    const path = `${node.url.replace('graphql', '')}logs/download`;
    const a = document.createElement('a');
    a.href = path;
    a.download = path.substring(path.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      this.downloadingNodes = toggleItem(this.downloadingNodes, index);
      this.detect();
    }, 1000);
  }

  setActiveBlock(): void {
    this.store.dispatch<DashboardNodesSetActiveBlock>({ type: DASHBOARD_NODES_SET_ACTIVE_BLOCK, payload: { height: this.latestHeight, fetchNew: true } });
    this.router.navigate([Routes.DASHBOARD, Routes.NODES, this.latestHeight], { queryParamsHandling: 'merge' });
  }
}
