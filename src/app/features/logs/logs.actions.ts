import { FeatureAction } from '@shared/types/store/feature-action.type';
import { Log } from '@shared/types/logs/log.type';

enum LogsInitActionTypes {
  LOGS_INIT = 'LOGS_INIT',
  LOGS_CLOSE = 'LOGS_CLOSE',
  LOGS_GET_LOGS = 'LOGS_GET_LOGS',
  LOGS_GET_LOGS_SUCCESS = 'LOGS_GET_LOGS_SUCCESS',
  LOGS_SET_ACTIVE_LOG = 'LOGS_SET_ACTIVE_LOG',
}

export const LOGS_INIT = LogsInitActionTypes.LOGS_INIT;
export const LOGS_CLOSE = LogsInitActionTypes.LOGS_CLOSE;
export const LOGS_GET_LOGS = LogsInitActionTypes.LOGS_GET_LOGS;
export const LOGS_GET_LOGS_SUCCESS = LogsInitActionTypes.LOGS_GET_LOGS_SUCCESS;
export const LOGS_SET_ACTIVE_LOG = LogsInitActionTypes.LOGS_SET_ACTIVE_LOG;

export interface LogsAction extends FeatureAction<LogsInitActionTypes> {
  readonly type: LogsInitActionTypes;
}

export class LogsInit implements LogsAction {
  readonly type = LOGS_INIT;
}

export class LogsClose implements LogsAction {
  readonly type = LOGS_CLOSE;
}

export class LogsGetLogs implements LogsAction {
  readonly type = LOGS_GET_LOGS;
}

export class LogsGetLogsSuccess implements LogsAction {
  readonly type = LOGS_GET_LOGS_SUCCESS;

  constructor(public payload: Log[]) { }
}

export class LogsSetActiveLog implements LogsAction {
  readonly type = LOGS_SET_ACTIVE_LOG;

  constructor(public payload: Log) { }
}


export type LogsActions = LogsInit
  | LogsClose
  | LogsGetLogs
  | LogsGetLogsSuccess
  | LogsSetActiveLog
  ;
