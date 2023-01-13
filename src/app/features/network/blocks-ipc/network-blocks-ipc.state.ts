import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkBlocksIpcState } from '@network/network.state';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { NetworkBlockIpc } from '@shared/types/network/blocks-ipc/network-block-ipc.type';

export interface NetworkBlocksIpcState {
  blocks: NetworkBlockIpc[];
  filteredBlocks: NetworkBlockIpc[];
  stream: boolean;
  sort: TableSort<NetworkBlockIpc>;
  openSidePanel: boolean;
  allFilters: string[];
  activeFilters: string[];
  activeBlock: number;
  earliestBlock: number;
}

const select = <T>(selector: (state: NetworkBlocksIpcState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectNetworkBlocksIpcState,
  selector,
);

export const selectNetworkBlocksIpc = select((network: NetworkBlocksIpcState): NetworkBlockIpc[] => network.filteredBlocks);
export const selectNetworkBlocksIpcActiveBlock = select((network: NetworkBlocksIpcState): number => network.activeBlock);
export const selectNetworkBlocksIpcEarliestBlock = select((network: NetworkBlocksIpcState): number => network.earliestBlock);
export const selectNetworkBlocksIpcSorting = select((network: NetworkBlocksIpcState): TableSort<NetworkBlockIpc> => network.sort);
export const selectNetworkBlocksIpcSidePanelOpen = select((network: NetworkBlocksIpcState): boolean => network.openSidePanel);
export const selectNetworkBlocksIpcAllFilters = select((network: NetworkBlocksIpcState): string[] => network.allFilters);
export const selectNetworkBlocksIpcActiveFilters = select((network: NetworkBlocksIpcState): string[] => network.activeFilters);
