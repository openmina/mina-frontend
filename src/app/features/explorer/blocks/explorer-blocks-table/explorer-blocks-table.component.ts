import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { selectExplorerBlocks, selectExplorerBlocksSorting } from '@explorer/blocks/explorer-blocks.state';
import { EXPLORER_BLOCKS_SORT, ExplorerBlocksSort } from '@explorer/blocks/explorer-blocks.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';

@UntilDestroy()
@Component({
  selector: 'mina-explorer-blocks-table',
  templateUrl: './explorer-blocks-table.component.html',
  styleUrls: ['./explorer-blocks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerBlocksTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;
  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<ExplorerBlock>[] = [
    { name: 'date', sort: 'timestamp' },
    { name: 'hash' },
    { name: 'height' },
    { name: 'tx. count', sort: 'txCount' },
    { name: 'snark count', sort: 'snarkCount' },
    { name: 'staged ledger hash', sort: 'stagedLedgerHash' },
    { name: 'snarked ledger hash', sort: 'snarkedLedgerHash' },
  ];

  blocks: ExplorerBlock[] = [];
  currentSort: TableSort<ExplorerBlock>;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToSortingChanges();
    this.listenToBlocks();
  }

  private listenToBlocks(): void {
    this.store.select(selectExplorerBlocks)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: ExplorerBlock[]) => {
        this.blocks = blocks;
        this.detect();
      });
  }

  private listenToSortingChanges(): void {
    this.store.select(selectExplorerBlocksSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.detect();
      });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<ExplorerBlocksSort>({
      type: EXPLORER_BLOCKS_SORT,
      payload: { sortBy: sortBy as keyof ExplorerBlock, sortDirection },
    });
  }

  onRowClick(node: ExplorerBlock): void {
    // if (this.activeNode?.index !== node.index && node.hash) {
    //   this.activeNode = node;
    //   this.store.dispatch<DashboardNodesSetActiveNode>({ type: DASHBOARD_NODES_SET_ACTIVE_NODE, payload: node });
    // }
  }

  goToScanState(height: number): void {
    this.router.navigate([Routes.EXPLORER, Routes.SCAN_STATE, height]);
  }
}
