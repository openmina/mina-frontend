import { Log } from '@shared/types/logs/log.type';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';

export interface LogsState {
  logs: Log[];
  activeLog: Log;
}

const select = <T>(selector: (state: LogsState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectLogsState,
  selector,
);

export const selectLogsState = createFeatureSelector<LogsState>('logs');
export const selectLogs = select((state: LogsState): Log[] => state.logs);
export const selectActiveLog = select((state: LogsState): Log => state.activeLog);
