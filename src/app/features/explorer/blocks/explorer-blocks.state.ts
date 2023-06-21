import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { selectExplorerBlocksState } from '@explorer/explorer.state';
import { ExplorerBlockTx } from '@shared/types/explorer/blocks/explorer-block-tx.type';
import { ExplorerBlockZkApp } from '@shared/types/explorer/blocks/explorer-block-zk-app-type';

export interface ExplorerBlocksState {
  blocks: ExplorerBlock[];
  sort: TableSort<ExplorerBlock>;
  activeBlock: ExplorerBlock;
  txs: ExplorerBlockTx[];
  zkApps: ExplorerBlockZkApp[];
  activeZkApp: ExplorerBlockZkApp;
  zkAppsSort: TableSort<ExplorerBlockZkApp>;
}

const select = <T>(selector: (state: ExplorerBlocksState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectExplorerBlocksState,
  selector,
);

export const selectExplorerBlocks = select((state: ExplorerBlocksState): ExplorerBlock[] => state.blocks);
export const selectExplorerBlocksSorting = select((state: ExplorerBlocksState): TableSort<ExplorerBlock> => state.sort);
export const selectExplorerBlocksActiveBlock = select((state: ExplorerBlocksState): ExplorerBlock => state.activeBlock);
export const selectExplorerBlocksTxsAndZkApps = select((state: ExplorerBlocksState): [ExplorerBlockTx[], ExplorerBlockZkApp[]] => [state.txs, state.zkApps]);
export const selectExplorerBlocksActiveZkApp = select((state: ExplorerBlocksState): ExplorerBlockZkApp => state.activeZkApp);
export const selectExplorerBlocksZkAppsSorting = select((state: ExplorerBlocksState): TableSort<ExplorerBlockZkApp> => state.zkAppsSort);
