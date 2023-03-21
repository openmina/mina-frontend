import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { selectExplorerBlocks, selectExplorerBlocksSorting } from '@explorer/blocks/explorer-blocks.state';
import { ExplorerBlocksSort } from '@explorer/blocks/explorer-blocks.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-explorer-blocks-table',
  templateUrl: './explorer-blocks-table.component.html',
  styleUrls: ['./explorer-blocks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerBlocksTableComponent extends StoreDispatcher implements OnInit {

  readonly itemSize: number = 36;
  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<ExplorerBlock>[] = [
    { name: 'date', sort: 'timestamp' },
    { name: 'hash' },
    { name: 'height' },
    { name: 'global slot', sort: 'globalSlot' },
    { name: 'user commands', sort: 'txCount' },
    { name: 'zk apps', sort: 'zkAppsCount' },
    { name: 'total transactions', sort: 'totalTxCount', tooltip: 'User commands + Fee transfers + Zkapp commands + 1 coinbase' },
    { name: 'snark jobs', sort: 'snarkCount' },
    { name: 'staged ledger hash', sort: 'stagedLedgerHash' },
    { name: 'snarked ledger hash', sort: 'snarkedLedgerHash' },
  ];

  blocks: ExplorerBlock[] = [];
  currentSort: TableSort<ExplorerBlock>;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToSortingChanges();
    this.listenToBlocks();
  }

  private listenToBlocks(): void {
    this.select(selectExplorerBlocks, (blocks: ExplorerBlock[]) => {
      this.blocks = blocks;
      this.detect();
    });
  }

  private listenToSortingChanges(): void {
    this.select(selectExplorerBlocksSorting, sort => {
      this.currentSort = sort;
      this.detect();
    });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(ExplorerBlocksSort, { sortBy: sortBy as keyof ExplorerBlock, sortDirection });
  }

  onRowClick(node: ExplorerBlock): void {
    // if (this.activeNode?.index !== node.index && node.hash) {
    //   this.activeNode = node;
    //   this.dispatch>(DashboardNodesSetActiveNode, node);
    // }
  }

  goToScanState(height: number): void {
    this.router.navigate([Routes.EXPLORER, Routes.SCAN_STATE, height]);
  }
}
