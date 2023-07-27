import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectDswLiveState } from '@dsw/dsw.state';
import { DswLiveNode } from '@shared/types/dsw/live/dsw-live-node.type';
import { DswLiveBlockEvent } from '@shared/types/dsw/live/dsw-live-block-event.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

export interface DswLiveState {
  nodes: DswLiveNode[];
  activeNode: DswLiveNode;
  sort: TableSort<DswLiveBlockEvent>;
  openSidePanel: boolean;
  filteredEvents: DswLiveBlockEvent[];
  filters: string[];
}

const select = <T>(selector: (state: DswLiveState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectDswLiveState,
  selector,
);

export const selectDswLiveNodes = select((state: DswLiveState): DswLiveNode[] => state.nodes);
export const selectDswLiveSort = select((state: DswLiveState): TableSort<DswLiveBlockEvent> => state.sort);
export const selectDswLiveActiveNode = select((state: DswLiveState): DswLiveNode => state.activeNode);
export const selectDswLiveOpenSidePanel = select((state: DswLiveState): boolean => state.openSidePanel);
export const selectDswLiveFilters = select((state: DswLiveState): string[] => state.filters);
export const selectDswLiveFilteredEvents = select((state: DswLiveState): DswLiveBlockEvent[] => state.filteredEvents);
