import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { selectExplorerBlocksState } from '@explorer/explorer.state';
import { ExplorerBlockTx } from '@shared/types/explorer/blocks/explorer-block-tx.type';

export interface ExplorerBlocksState {
  blocks: ExplorerBlock[];
  sort: TableSort<ExplorerBlock>;
  activeBlock: ExplorerBlock;
  txs: ExplorerBlockTx[];
  zkApps: any[];
}

const select = <T>(selector: (state: ExplorerBlocksState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectExplorerBlocksState,
  selector,
);

export const selectExplorerBlocks = select((state: ExplorerBlocksState): ExplorerBlock[] => state.blocks);
export const selectExplorerBlocksSorting = select((state: ExplorerBlocksState): TableSort<ExplorerBlock> => state.sort);
export const selectExplorerBlocksActiveBlock = select((state: ExplorerBlocksState): ExplorerBlock => state.activeBlock);
export const selectExplorerBlocksTxsAndZkApps = select((state: ExplorerBlocksState): [ExplorerBlockTx[], any[]] => [state.txs, state.zkApps]);
