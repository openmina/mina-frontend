import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectWebNodeLogsState } from '@web-node/web-node.state';

export interface WebNodeLogsState {
  activeLog: WebNodeLog;
}

const select = <T>(selector: (state: WebNodeLogsState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectWebNodeLogsState,
  selector,
);

export const selectWebNodeLogsActiveLog = select((webNode: WebNodeLogsState): WebNodeLog => webNode.activeLog);
