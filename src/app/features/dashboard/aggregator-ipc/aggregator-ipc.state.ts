import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { selectAggregatorIpcState } from '@dashboard/dashboard.state';
import { AggregatorIpc } from '@shared/types/dashboard/aggregator-ipc/aggregator-ipc.type';

export interface AggregatorIpcState {
  messages: AggregatorIpc[];
  filteredMessages: AggregatorIpc[];
  stream: boolean;
  sort: TableSort<AggregatorIpc>;
  activeBlock: number;
  earliestBlock: number;
  allFilters: string[];
  activeFilters: string[];
  nodeCount: number;
}

const select = <T>(selector: (state: AggregatorIpcState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectAggregatorIpcState,
  selector,
);

export const selectAggregatorIpcMessages = select((state: AggregatorIpcState): AggregatorIpc[] => state.filteredMessages);
export const selectAggregatorIpcActiveBlock = select((state: AggregatorIpcState): number => state.activeBlock);
export const selectAggregatorIpcEarliestBlock = select((state: AggregatorIpcState): number => state.earliestBlock);
export const selectAggregatorIpcSorting = select((state: AggregatorIpcState): TableSort<AggregatorIpc> => state.sort);
export const selectAggregatorIpcAllFilters = select((state: AggregatorIpcState): string[] => state.allFilters);
export const selectAggregatorIpcActiveFilters = select((state: AggregatorIpcState): string[] => state.activeFilters);
export const selectAggregatorIpcNodeCount = select((state: AggregatorIpcState): number => state.nodeCount);
