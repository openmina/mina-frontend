import { FeatureAction } from '@shared/types/store/feature-action.type';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';

enum WebNodeLogsActionTypes {
  WEB_NODE_LOGS_SELECT_LOG = 'WEB_NODE_LOGS_SELECT_LOG',
  WEB_NODE_LOGS_CLOSE = 'WEB_NODE_LOGS_CLOSE',
}

export const WEB_NODE_LOGS_SELECT_LOG = WebNodeLogsActionTypes.WEB_NODE_LOGS_SELECT_LOG;
export const WEB_NODE_LOGS_CLOSE = WebNodeLogsActionTypes.WEB_NODE_LOGS_CLOSE;

export interface WebNodeLogsAction extends FeatureAction<WebNodeLogsActionTypes> {
  readonly type: WebNodeLogsActionTypes;
}

export class WebNodeLogsSelectLog implements WebNodeLogsAction {
  readonly type = WEB_NODE_LOGS_SELECT_LOG;

  constructor(public payload: WebNodeLog) {}
}

export class WebNodeLogsClose implements WebNodeLogsAction {
  readonly type = WEB_NODE_LOGS_CLOSE;
}

export type WebNodeLogsActions =
  | WebNodeLogsSelectLog
  | WebNodeLogsClose
  ;
