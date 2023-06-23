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
import { filter } from 'rxjs';
import { toggleItem } from '@shared/helpers/array.helper';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import { CONFIG } from '@shared/constants/config';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';

@Component({
  selector: 'mina-dashboard-nodes-table',
  templateUrl: './dashboard-nodes-table.component.html',
  styleUrls: ['./dashboard-nodes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class DashboardNodesTableComponent extends MinaTableWrapper<DashboardNode> implements OnInit {

  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
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
      { name: 'logs', sort: 'name' },
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
  currentHeightIsTooBig: boolean;
  latestHeight: number;

  private activeNode: DashboardNode;
  private activeHeight: number;

  @ViewChild('minimalRowTemplate') private minimalRowTemplate: TemplateRef<DashboardNode>;

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToNodeList();
    this.listenToActiveDashboardNodeChange();
    this.listenToLatestLevelChange();
    this.listenToActiveLevelChange();
  }

  protected override setupTable(): void {
    this.table.rowTemplate = CONFIG.nodeLister ? this.minimalRowTemplate : this.rowTemplate;
    this.table.propertyForActiveCheck = 'index';
    this.table.gridTemplateColumns = CONFIG.nodeLister
      ? [200, 105, 145, 80, 160, 90, 140, 100, 110, 110]
      : [200, 105, 145, 75, 140, 80, 135, 160, 90, 140, 100, 110, 90, 100, 110];
    this.table.sortClz = DashboardNodesSort;
    this.table.sortSelector = selectDashboardNodesSorting;
  }

  private listenToActiveLevelChange(): void {
    this.select(selectDashboardNodesActiveBlockLevel, (height: number) => {
      this.activeHeight = height;
      this.toggleHeightMismatching();
    });
  }

  private listenToLatestLevelChange(): void {
    this.select(selectDashboardNodesEarliestBlockLevel, (height: number) => {
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
    this.select(selectDashboardNodes, (nodes: DashboardNode[]) => {
      this.table.rows = nodes;
      this.table.detect();
      this.detect();
    });
  }

  private listenToActiveDashboardNodeChange(): void {
    this.select(selectDashboardNodesActiveNode, (node: DashboardNode) => {
      this.activeNode = node;
      this.table.activeRow = node;
      this.table.detect();
      this.detect();
    }, filter(node => node !== this.activeNode));
  }

  protected override onRowClick(node: DashboardNode): void {
    if (this.activeNode?.index !== node.index && node.hash) {
      this.dispatch(DashboardNodesSetActiveNode, node);
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
    this.dispatch(DashboardNodesSetActiveBlock, { height: this.latestHeight });
    this.router.navigate([Routes.DASHBOARD, Routes.NODES, this.latestHeight], { queryParamsHandling: 'merge' });
  }
}
