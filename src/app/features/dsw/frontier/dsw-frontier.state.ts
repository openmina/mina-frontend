import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectDswFrontierState } from '@dsw/dsw.state';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { DswFrontierLog } from '@shared/types/dsw/frontier/dsw-frontier-log.type';

export interface DswFrontierState {
  logs: DswFrontierLog[];
  activeLog: DswFrontierLog;
  openSidePanel: boolean;
  sort: TableSort<DswFrontierLog>;
}

const select = <T>(selector: (state: DswFrontierState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectDswFrontierState,
  selector,
);

export const selectDswFrontierLogs = select((state: DswFrontierState): DswFrontierLog[] => state.logs);
export const selectDswFrontierActiveLog = select((state: DswFrontierState): DswFrontierLog => state.activeLog);
export const selectDswFrontierSort = select((state: DswFrontierState): TableSort<DswFrontierLog> => state.sort);