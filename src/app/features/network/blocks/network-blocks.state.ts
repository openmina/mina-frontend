import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkBlocksState } from '@network/network.state';
import { TableSort } from '@shared/types/shared/table-sort.type';

export interface NetworkBlocksState {
  blocks: NetworkBlock[];
  filteredBlocks: NetworkBlock[];
  stream: boolean;
  sort: TableSort;
  openSidePanel: boolean;
  allFilters: string[];
  activeFilters: string[];
  activeBlock: number;
}

const select = <T>(selector: (state: NetworkBlocksState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectNetworkBlocksState,
  selector,
);

export const selectNetworkBlocks = select((network: NetworkBlocksState): NetworkBlock[] => network.filteredBlocks);
export const selectNetworkBlocksActiveBlock = select((network: NetworkBlocksState): number => network.activeBlock);
export const selectNetworkBlocksSorting = select((network: NetworkBlocksState): TableSort => network.sort);
export const selectNetworkBlocksSidePanelOpen = select((network: NetworkBlocksState): boolean => network.openSidePanel);
export const selectNetworkBlocksAllFilters = select((network: NetworkBlocksState): string[] => network.allFilters);
export const selectNetworkBlocksActiveFilters = select((network: NetworkBlocksState): string[] => network.activeFilters);
