import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkBlocksState } from '@network/network.state';

export interface NetworkBlocksState {
  blocks: NetworkBlock[];
  stream: boolean;
  activeBlock: NetworkBlock;
}

const select = <T>(selector: (state: NetworkBlocksState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectNetworkBlocksState,
  selector,
);

export const selectNetworkBlocks = select((network: NetworkBlocksState): NetworkBlock[] => network.blocks);
export const selectNetworkBlocksActiveBlock = select((network: NetworkBlocksState): NetworkBlock => network.activeBlock);
