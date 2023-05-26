import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { selectExplorerBlocks, selectExplorerBlocksActiveBlock, selectExplorerBlocksSorting } from '@explorer/blocks/explorer-blocks.state';
import { ExplorerBlocksSetActiveBlock, ExplorerBlocksSort } from '@explorer/blocks/explorer-blocks.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';
import { untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from 'rxjs';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';

@Component({
  selector: 'mina-explorer-blocks-table',
  templateUrl: './explorer-blocks-table.component.html',
  styleUrls: ['./explorer-blocks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerBlocksTableComponent extends StoreDispatcher implements OnInit {

  private readonly tableHeads: TableColumnList<ExplorerBlock> = [
    { name: 'date', sort: 'timestamp' },
    { name: 'hash' },
    { name: 'height' },
    { name: 'global slot', sort: 'globalSlot' },
    { name: 'user commands', sort: 'txCount' },
    { name: 'zk apps', sort: 'zkAppsCount' },
    { name: 'total transactions', sort: 'totalTxCount', tooltip: 'User commands + Fee transfers + ZkApp commands + 1 coinbase' },
    { name: 'snark jobs', sort: 'snarkCount' },
    { name: 'staged ledger hash', sort: 'stagedLedgerHash' },
    { name: 'snarked ledger hash', sort: 'snarkedLedgerHash' },
  ];

  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<ExplorerBlock>;
  @ViewChild('minaTable', { read: ViewContainerRef }) private containerRef: ViewContainerRef;

  private table: MinaTableComponent<ExplorerBlock>;
  private activeBlock: ExplorerBlock;
  private hashFromRoute: string;

  constructor(private router: Router) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<ExplorerBlock>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = this.rowTemplate;
      this.table.gridTemplateColumns = [175, 140, 95, 100, 135, 115, 170, 115, 160, 163];
      this.table.rowClickEmitter.pipe(untilDestroyed(this)).subscribe((row: ExplorerBlock) => this.onRowClick(row));
      this.table.sortClz = ExplorerBlocksSort;
      this.table.sortSelector = selectExplorerBlocksSorting;
      this.table.init();
    });
    this.listenToRouteChange();
    this.listenToBlocks();
    this.listenToActiveTraceChange();
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['hash'] && this.table.rows.length === 0) {
        this.hashFromRoute = route.params['hash'];
      }
    }, take(1));
  }

  private listenToBlocks(): void {
    this.select(selectExplorerBlocks, (blocks: ExplorerBlock[]) => {
      this.table.rows = blocks;
      this.table.detect();
      if (this.hashFromRoute) {
        this.scrollToElement();
      }
    }, filter(blocks => blocks.length > 0));
  }

  private listenToActiveTraceChange(): void {
    this.select(selectExplorerBlocksActiveBlock, (activeBlock: ExplorerBlock) => {
      this.activeBlock = activeBlock;
      this.table.activeRow = activeBlock;
      this.table.detect();
    }, filter(trace => trace !== this.activeBlock));
  }

  private scrollToElement(): void {
    const finder = (block: ExplorerBlock) => block.hash === this.hashFromRoute;
    const i = this.table.rows.findIndex(finder);
    this.table.scrollToElement(finder);
    delete this.hashFromRoute;
    this.onRowClick(this.table.rows[i]);
  }

  goToScanState(height: number): void {
    this.router.navigate([Routes.EXPLORER, Routes.SCAN_STATE, height]);
  }

  private onRowClick(block: ExplorerBlock): void {
    if (this.activeBlock?.hash !== block?.hash) {
      this.router.navigate([Routes.EXPLORER, Routes.BLOCKS, block.hash]);
      this.dispatch(ExplorerBlocksSetActiveBlock, block);
    }
  }
}
