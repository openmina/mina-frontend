import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { DashboardNode } from '@shared/types/dashboard/nodes/dashboard-node.type';
import {
  selectDashboardNodes,
  selectDashboardNodesActiveBlockLevel,
  selectDashboardNodesActiveNode,
  selectDashboardNodesEarliestBlockLevel,
  selectDashboardNodesSorting,
} from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNodesSetActiveBlock, DashboardNodesSetActiveNode, DashboardNodesSort } from '@dashboard/nodes/dashboard-nodes.actions';
import { filter, take } from 'rxjs';
import { toggleItem } from '@shared/helpers/array.helper';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import { CONFIG } from '@shared/constants/config';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';

@Component({
  selector: 'mina-dashboard-nodes-table',
  templateUrl: './dashboard-nodes-table.component.html',
  styleUrls: ['./dashboard-nodes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class DashboardNodesTableComponent extends MinaTableWrapper<DashboardNode> implements OnInit {

  readonly secConfig: SecDurationConfig = { color: true, default: 0.5, warn: 0.75, severe: 1, undefinedAlternative: '-' };
  protected readonly tableHeads: TableColumnList<DashboardNode> = CONFIG.nodeLister
    ? [
      { name: 'name' },
      { name: 'status' },
      { name: 'candidate', sort: 'hash' },
      { name: 'height', sort: 'blockchainLength' },
      { name: 'datetime', sort: 'timestamp' },
      { name: 'latency' },
      { name: 'block application', sort: 'blockApplication' },
      { name: 'source' },
      { name: 'trace status', sort: 'traceStatus' },
    ]
    : [
      { name: 'name' },
      { name: 'status' },
      { name: 'candidate', sort: 'hash' },
      { name: 'branch' },
      { name: 'best tip', sort: 'bestTip' },
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

  downloadingNodes: number[] = [];
  currentSlotIsTooBig: boolean;
  earliestSlot: number;

  private activeNode: DashboardNode;
  private activeSlot: number;
  private nameFromRoute: string;

  @ViewChild('minimalRowTemplate') private minimalRowTemplate: TemplateRef<DashboardNode>;

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToRouteChange();
    this.listenToActiveNodeChange();
    this.listenToLatestLevelChange();
    this.listenToActiveLevelChange();
    this.listenToNodeList();
  }

  protected override setupTable(): void {
    this.table.rowTemplate = CONFIG.nodeLister ? this.minimalRowTemplate : this.rowTemplate;
    this.table.propertyForActiveCheck = 'index';
    this.table.gridTemplateColumns = CONFIG.nodeLister
      ? [130, 105, 145, 80, 160, 90, 140, 100, 110]
      : [200, 105, 145, 75, 140, 80, 135, 160, 90, 140, 100, 110, 90, 100, 110];
    this.table.sortClz = DashboardNodesSort;
    this.table.sortSelector = selectDashboardNodesSorting;
  }

  private listenToActiveLevelChange(): void {
    this.select(selectDashboardNodesActiveBlockLevel, (slot: number) => {
      this.activeSlot = slot;
      this.toggleHeightMismatching();
    });
  }

  private listenToLatestLevelChange(): void {
    this.select(selectDashboardNodesEarliestBlockLevel, (slot: number) => {
      this.earliestSlot = slot;
      this.toggleHeightMismatching();
    });
  }

  private toggleHeightMismatching(): void {
    if (this.activeSlot > this.earliestSlot && !this.currentSlotIsTooBig) {
      this.currentSlotIsTooBig = true;
      this.detect();
    } else if (this.currentSlotIsTooBig) {
      if (this.activeSlot <= this.earliestSlot) {
        this.currentSlotIsTooBig = false;
      }
      this.detect();
    }
  }

  private listenToNodeList(): void {
    this.select(selectDashboardNodes, (nodes: DashboardNode[]) => {
      this.table.rows = nodes;
      this.table.detect();
      if (this.nameFromRoute && nodes.length > 0 && nodes.every(n => n.blockchainLength)) {
        this.scrollToElement();
      }
      this.detect();
    });
  }

  private listenToActiveNodeChange(): void {
    this.select(selectDashboardNodesActiveNode, (node: DashboardNode) => {
      this.activeNode = node;
      this.table.activeRow = node;
      this.table.detect();
      this.detect();
    }, filter(node => node !== this.activeNode));
  }

  private scrollToElement(): void {
    const finder = (node: DashboardNode) => node.name === this.nameFromRoute;
    const i = this.table.rows.findIndex(finder);
    this.table.scrollToElement(finder);
    delete this.nameFromRoute;
    this.onRowClick(this.table.rows[i]);
  }

  protected override onRowClick(node: DashboardNode): void {
    if (!node) {
      return;
    }
    if (!this.activeNode || this.activeNode.index !== node.index && node.hash) {
      this.dispatch(DashboardNodesSetActiveNode, node);
      this.router.navigate([Routes.DASHBOARD, Routes.NODES, this.activeSlot], {
        queryParamsHandling: 'merge',
        queryParams: { name: node.name },
      });
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
    this.dispatch(DashboardNodesSetActiveBlock, { height: this.earliestSlot });
    this.router.navigate([Routes.DASHBOARD, Routes.NODES, this.earliestSlot], { queryParamsHandling: 'merge' });
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.queryParams['name'] && this.table.rows.length === 0) {
        this.nameFromRoute = route.queryParams['name'];
      }
    }, take(1));
  }
}
