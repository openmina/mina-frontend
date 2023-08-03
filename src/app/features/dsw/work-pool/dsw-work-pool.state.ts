import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectDswWorkPoolState } from '@dsw/dsw.state';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { WorkPoolSpecs } from '@shared/types/dsw/work-pool/work-pool-specs.type';

export interface DswWorkPoolState {
  workPools: WorkPool[];
  filteredWorkPools: WorkPool[];
  activeWorkPool: WorkPool;
  openSidePanel: boolean;
  sort: TableSort<WorkPool>;
  filters: string[];
  activeWorkPoolSpecs: WorkPoolSpecs;
}

const select = <T>(selector: (state: DswWorkPoolState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectDswWorkPoolState,
  selector,
);

export const selectDswWorkPools = select((state: DswWorkPoolState): WorkPool[] => state.filteredWorkPools);
export const selectDswWorkPoolActiveWorkPool = select((state: DswWorkPoolState): WorkPool => state.activeWorkPool);
export const selectDswWorkPoolOpenSidePanel = select((state: DswWorkPoolState): boolean => state.openSidePanel);
export const selectDswWorkPoolSort = select((state: DswWorkPoolState): TableSort<WorkPool> => state.sort);
export const selectDswWorkPoolFilters = select((state: DswWorkPoolState): string[] => state.filters);
export const selectDswWorkPoolActiveWorkPoolSpecs = select((state: DswWorkPoolState): WorkPoolSpecs => state.activeWorkPoolSpecs);
