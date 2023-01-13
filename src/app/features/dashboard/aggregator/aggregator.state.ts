import { DashboardMessage } from '@shared/types/dashboard/dashboard-message';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { selectAggregatorState } from '@dashboard/dashboard.state';

export interface AggregatorState {
  messages: DashboardMessage[];
  filteredMessages: DashboardMessage[];
  stream: boolean;
  sort: TableSort<DashboardMessage>;
  openSidePanel: boolean;
  activeBlock: number;
  earliestBlock: number;
  allFilters: string[];
  activeFilters: string[];
  nodeCount: number;
}

const select = <T>(selector: (state: AggregatorState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectAggregatorState,
  selector,
);

export const selectAggregatorMessages = select((state: AggregatorState): DashboardMessage[] => state.filteredMessages);
export const selectAggregatorActiveBlock = select((state: AggregatorState): number => state.activeBlock);
export const selectAggregatorEarliestBlock = select((state: AggregatorState): number => state.earliestBlock);
export const selectAggregatorSorting = select((state: AggregatorState): TableSort<DashboardMessage> => state.sort);
export const selectAggregatorSidePanelOpen = select((state: AggregatorState): boolean => state.openSidePanel);
export const selectAggregatorAllFilters = select((state: AggregatorState): string[] => state.allFilters);
export const selectAggregatorActiveFilters = select((state: AggregatorState): string[] => state.activeFilters);
export const selectAggregatorNodeCount = select((state: AggregatorState): number => state.nodeCount);
