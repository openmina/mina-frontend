import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { Router } from '@angular/router';
import { DswBootstrapSetActiveBlock, DswBootstrapSortBlocks, DswBootstrapToggleSidePanel } from '@dsw/bootstrap/dsw-bootstrap.actions';
import {
  selectDswBootstrapActiveNode,
  selectDswBootstrapNodes,
  selectDswBootstrapOpenSidePanel,
  selectDswBootstrapSort,
} from '@dsw/bootstrap/dsw-bootstrap.state';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { delay, delayWhen, filter, mergeMap, of, take } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { DswBootstrapNode } from '@shared/types/dsw/bootstrap/dsw-bootstrap-node.type';
import { hasValue } from '@shared/helpers/values.helper';

@Component({
  selector: 'mina-dsw-bootstrap-table',
  templateUrl: './dsw-bootstrap-table.component.html',
  styleUrls: ['./dsw-bootstrap-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswBootstrapTableComponent extends MinaTableWrapper<DswBootstrapNode> implements OnInit {

  openSidePanel: boolean = true;

  protected readonly tableHeads: TableColumnList<DswBootstrapNode> = [
    { name: '#', sort: 'index' },
    { name: 'global slot', sort: 'globalSlot' },
    { name: 'height' },
    { name: 'best tip', sort: 'bestTip' },
    { name: 'amount', sort: 'fetchedBlocks' },
    { name: 'min', sort: 'fetchedBlocksMin' },
    { name: 'max', sort: 'fetchedBlocksMax' },
    { name: 'avg', sort: 'fetchedBlocksAvg' },
    { name: 'amount', sort: 'appliedBlocks' },
    { name: 'min', sort: 'appliedBlocksMin' },
    { name: 'max', sort: 'appliedBlocksMax' },
    { name: 'avg', sort: 'appliedBlocksAvg' },
  ];

  private indexFromRoute: number;

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToRouteChange();
    this.listenToNodesChanges();
    this.listenToActiveNodeChange();
    this.listenToSidePanelOpening();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [50, 100, 80, 130, 80, 50, 50, 80, 80, 50, 50, 80];
    this.table.propertyForActiveCheck = 'index';
    this.table.sortClz = DswBootstrapSortBlocks;
    this.table.sortSelector = selectDswBootstrapSort;
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['index'] && this.table.rows.length === 0) {
        this.indexFromRoute = Number(route.params['index']);
      }
    }, take(1));
  }

  private listenToNodesChanges(): void {
    this.select(selectDswBootstrapNodes, (nodes: DswBootstrapNode[]) => {
      this.table.rows = nodes;
      this.table.detect();
      if (hasValue(this.indexFromRoute)) {
        this.scrollToElement();
      }
      this.detect();
    }, filter(nodes => nodes.length > 0));
  }

  private listenToActiveNodeChange(): void {
    this.select(selectDswBootstrapActiveNode, (node: DswBootstrapNode) => {
      this.table.activeRow = node;
      this.table.detect();
      this.detect();
    });
  }

  private scrollToElement(): void {
    const finder = (node: DswBootstrapNode) => node.index === this.indexFromRoute;
    const i = this.table.rows.findIndex(finder);
    this.table.scrollToElement(finder);
    delete this.indexFromRoute;
    this.onRowClick(this.table.rows[i]);
  }

  protected override onRowClick(row: DswBootstrapNode): void {
    if (this.table.activeRow?.index !== row?.index) {
      this.dispatch(DswBootstrapSetActiveBlock, row);
      this.router.navigate([Routes.SNARK_WORKER, Routes.BOOTSTRAP, row.index], { queryParamsHandling: 'merge' });
    }
  }

  toggleSidePanel(): void {
    this.dispatch(DswBootstrapToggleSidePanel);
  }

  private listenToSidePanelOpening(): void {
    this.select(selectDswBootstrapOpenSidePanel, (open: boolean) => {
      this.openSidePanel = !!open;
      this.detect();
    }, mergeMap((open: boolean) => of(open).pipe(delay(open ? 0 : 250))));
  }
}
