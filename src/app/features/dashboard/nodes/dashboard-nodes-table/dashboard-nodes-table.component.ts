import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { DashboardNode } from '@app/shared/types/dashboard/node-list/dashboard-node.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
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
  DashboardNodesSetActiveBlock,
  DashboardNodesSetActiveNode,
  DashboardNodesSort,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { filter } from 'rxjs';
import { toggleItem } from '@shared/helpers/array.helper';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';
import { CONFIG } from '@shared/constants/config';

@UntilDestroy()
@Component({
  selector: 'mina-dashboard-nodes-table',
  templateUrl: './dashboard-nodes-table.component.html',
  styleUrls: ['./dashboard-nodes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class DashboardNodesTableComponent extends ManualDetection implements OnInit {

  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  private readonly tableHeads: TableColumnList<DashboardNode> = CONFIG.nodeLister
    ? [
      { name: 'name' },
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

  nodes: DashboardNode[] = [];
  currentSort: TableSort<DashboardNode>;
  activeNode: DashboardNode;
  downloadingNodes: number[] = [];
  currentHeightIsTooBig: boolean;
  latestHeight: number;

  private activeHeight: number;

  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<DashboardNode>;
  @ViewChild('minimalRowTemplate') private minimalRowTemplate: TemplateRef<DashboardNode>;
  private containerRef: ViewContainerRef;

  @ViewChild('minaTable', { read: ViewContainerRef }) set minaTable(containerRef: ViewContainerRef) {
    this.containerRef = containerRef;
  }

  private table: MinaTableComponent<DashboardNode>;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  async ngOnInit(): Promise<void> {
    await this.createTableComponent();
    this.listenToNodeList();
    this.listenToActiveDashboardNodeChange();
    this.listenToLatestLevelChange();
    this.listenToActiveLevelChange();
  }

  private async createTableComponent(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<DashboardNode>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = CONFIG.nodeLister ? this.minimalRowTemplate : this.rowTemplate;
      this.table.propertyForActiveCheck = 'index';
      this.table.gridTemplateColumns = CONFIG.nodeLister
        ? [200, 145, 80, 160, 90, 140, 100, 110, 100]
        : [200, 105, 145, 75, 140, 80, 135, 160, 90, 140, 100, 110, 90, 100, 100];
      this.table.sortClz = DashboardNodesSort;
      this.table.sortSelector = selectDashboardNodesSorting;
      this.table.rowClickEmitter.pipe(untilDestroyed(this)).subscribe(node => this.onRowClick(node));
      this.table.init();
    });
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
        this.createTableComponent();
      }
      this.detect();
    }
  }

  private listenToNodeList(): void {
    this.store.select(selectDashboardNodes)
      .pipe(untilDestroyed(this))
      .subscribe((nodes: DashboardNode[]) => {
        this.nodes = nodes;
        this.table.rows = nodes;
        this.table.detect();
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
        this.table.activeRow = node;
        this.table.detect();
        this.detect();
      });
  }

  onRowClick(node: DashboardNode): void {
    if (this.activeNode?.index !== node.index && node.hash) {
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
