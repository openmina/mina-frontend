import { FeatureAction } from '@shared/types/store/feature-action.type';
import { DswFrontierLog } from '@shared/types/dsw/frontier/dsw-frontier-log.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

enum DswFrontierActionTypes {
  DSW_FRONTIER_GET_LOGS = 'DSW_FRONTIER_GET_LOGS',
  DSW_FRONTIER_GET_LOGS_SUCCESS = 'DSW_FRONTIER_GET_LOGS_SUCCESS',
  DSW_FRONTIER_TOGGLE_SIDE_PANEL = 'DSW_FRONTIER_TOGGLE_SIDE_PANEL',
  DSW_FRONTIER_SORT_LOGS = 'DSW_FRONTIER_SORT_LOGS',
  DSW_FRONTIER_SET_ACTIVE_LOG = 'DSW_FRONTIER_SET_ACTIVE_LOG',
  DSW_FRONTIER_CLOSE = 'DSW_FRONTIER_CLOSE',
}

export const DSW_FRONTIER_GET_LOGS = DswFrontierActionTypes.DSW_FRONTIER_GET_LOGS;
export const DSW_FRONTIER_GET_LOGS_SUCCESS = DswFrontierActionTypes.DSW_FRONTIER_GET_LOGS_SUCCESS;
export const DSW_FRONTIER_TOGGLE_SIDE_PANEL = DswFrontierActionTypes.DSW_FRONTIER_TOGGLE_SIDE_PANEL;
export const DSW_FRONTIER_SORT_LOGS = DswFrontierActionTypes.DSW_FRONTIER_SORT_LOGS;
export const DSW_FRONTIER_SET_ACTIVE_LOG = DswFrontierActionTypes.DSW_FRONTIER_SET_ACTIVE_LOG;
export const DSW_FRONTIER_CLOSE = DswFrontierActionTypes.DSW_FRONTIER_CLOSE;

export interface DswFrontierAction extends FeatureAction<DswFrontierActionTypes> {
  readonly type: DswFrontierActionTypes;
}

export class DswFrontierGetLogs implements DswFrontierAction {
  readonly type = DSW_FRONTIER_GET_LOGS;
}

export class DswFrontierGetLogsSuccess implements DswFrontierAction {
  readonly type = DSW_FRONTIER_GET_LOGS_SUCCESS;

  constructor(public payload: DswFrontierLog[]) { }
}

export class DswFrontierToggleSidePanel implements DswFrontierAction {
  readonly type = DSW_FRONTIER_TOGGLE_SIDE_PANEL;
}

export class DswFrontierSortLogs implements DswFrontierAction {
  readonly type = DSW_FRONTIER_SORT_LOGS;

  constructor(public payload: TableSort<DswFrontierLog>) { }
}

export class DswFrontierSetActiveLog implements DswFrontierAction {
  readonly type = DSW_FRONTIER_SET_ACTIVE_LOG;

  constructor(public payload: DswFrontierLog) { }
}

export class DswFrontierClose implements DswFrontierAction {
  readonly type = DSW_FRONTIER_CLOSE;
}

export type DswFrontierActions =
  | DswFrontierGetLogs
  | DswFrontierGetLogsSuccess
  | DswFrontierToggleSidePanel
  | DswFrontierSortLogs
  | DswFrontierSetActiveLog
  | DswFrontierClose
  ;
