import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ExpandTracking } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { selectExplorerBlocksActiveBlock, selectExplorerBlocksTxsAndZkApps } from '@explorer/blocks/explorer-blocks.state';
import { ExplorerBlockTx } from '@shared/types/explorer/blocks/explorer-block-tx.type';
import { ExplorerBlocksSetActiveBlock } from '@explorer/blocks/explorer-blocks.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';

@Component({
  selector: 'mina-explorer-blocks-side-panel',
  templateUrl: './explorer-blocks-side-panel.component.html',
  styleUrls: ['./explorer-blocks-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerBlocksSidePanelComponent extends StoreDispatcher implements OnInit {

  block: ExplorerBlock;
  txs: ExplorerBlockTx[];
  zkApps: any[] = [];
  expandTracking: ExpandTracking = {};
  selectedTabIndex: number = 0;

  constructor(private router: Router) {super();}

  ngOnInit(): void {
    this.listenToBlockChange();
    this.listenToTxsChange();
  }

  private listenToBlockChange(): void {
    this.select(selectExplorerBlocksActiveBlock, (block: ExplorerBlock) => {
      this.block = block;
      this.detect();
    });
  }

  private listenToTxsChange(): void {
    this.select(selectExplorerBlocksTxsAndZkApps, ([txs, zkApps]: [ExplorerBlockTx[], any[]]) => {
      this.txs = txs;
      this.zkApps = zkApps;
      this.detect();
    });
  }

  closeSidePanel(): void {
    this.dispatch(ExplorerBlocksSetActiveBlock, undefined);
    this.router.navigate([Routes.EXPLORER, Routes.BLOCKS]);
  }

}
