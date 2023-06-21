import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectDswActionsState } from '@dsw/dsw.state';
import { DswActionGroup } from '@shared/types/dsw/actions/dsw-action-group.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { DswActionsStats } from '@shared/types/dsw/actions/dsw-actions-stats.type';

export interface DswActionsState {
  groups: DswActionGroup[];
  filteredGroups: DswActionGroup[];
  openSidePanel: boolean;
  earliestSlot: number;
  activeSlot: number;
  currentSort: TableSort<DswActionGroup>;
  activeSearch: string;
  stats: DswActionsStats
}

const select = <T>(selector: (state: DswActionsState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectDswActionsState,
  selector,
);

export const selectDswActionsGroups = select((state: DswActionsState): DswActionGroup[] => state.filteredGroups);
export const selectDswActionsOpenSidePanel = select((state: DswActionsState): boolean => state.openSidePanel);
export const selectDswActionsActiveSlotAndStats = select((state: DswActionsState): [number, DswActionsStats] => [state.activeSlot, state.stats]);
export const selectDswActionsToolbarValues = select((state: DswActionsState): {
  earliestSlot: number;
  activeSlot: number;
  currentSort: TableSort<DswActionGroup>;
  activeSearch: string;
} => ({
  earliestSlot: state.earliestSlot,
  activeSlot: state.activeSlot,
  currentSort: state.currentSort,
  activeSearch: state.activeSearch,
}));
export const selectDswActionsSort = select((state: DswActionsState): TableSort<DswActionGroup> => state.currentSort);

