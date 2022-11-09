import { FeatureAction } from '@shared/types/store/feature-action.type';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';

enum WebNodeSharedActionTypes {
  WEB_NODE_SHARED_INIT = 'WEB_NODE_SHARED_INIT',
  WEB_NODE_SHARED_MARK_AS_OPENED = 'WEB_NODE_SHARED_MARK_AS_OPENED',
  WEB_NODE_SHARED_GET_PEERS = 'WEB_NODE_SHARED_GET_PEERS',
  WEB_NODE_SHARED_GET_PEERS_SUCCESS = 'WEB_NODE_SHARED_GET_PEERS_SUCCESS',
  WEB_NODE_SHARED_GET_LOGS = 'WEB_NODE_SHARED_GET_LOGS',
  WEB_NODE_SHARED_GET_LOGS_SUCCESS = 'WEB_NODE_SHARED_GET_LOGS_SUCCESS',
}

export const WEB_NODE_SHARED_INIT = WebNodeSharedActionTypes.WEB_NODE_SHARED_INIT;
export const WEB_NODE_SHARED_MARK_AS_OPENED = WebNodeSharedActionTypes.WEB_NODE_SHARED_MARK_AS_OPENED;
export const WEB_NODE_SHARED_GET_PEERS = WebNodeSharedActionTypes.WEB_NODE_SHARED_GET_PEERS;
export const WEB_NODE_SHARED_GET_PEERS_SUCCESS = WebNodeSharedActionTypes.WEB_NODE_SHARED_GET_PEERS_SUCCESS;
export const WEB_NODE_SHARED_GET_LOGS = WebNodeSharedActionTypes.WEB_NODE_SHARED_GET_LOGS;
export const WEB_NODE_SHARED_GET_LOGS_SUCCESS = WebNodeSharedActionTypes.WEB_NODE_SHARED_GET_LOGS_SUCCESS;

export interface WebNodeSharedAction extends FeatureAction<WebNodeSharedActionTypes> {
  readonly type: WebNodeSharedActionTypes;
}

export class WebNodeSharedInit implements WebNodeSharedAction {
  readonly type = WEB_NODE_SHARED_INIT;
}

export class WebNodeSharedMarkAsOpened implements WebNodeSharedAction {
  readonly type = WEB_NODE_SHARED_MARK_AS_OPENED;
}

export class WebNodeSharedGetPeers implements WebNodeSharedAction {
  readonly type = WEB_NODE_SHARED_GET_PEERS;
}

export class WebNodeSharedGetPeersSuccess implements WebNodeSharedAction {
  readonly type = WEB_NODE_SHARED_GET_PEERS_SUCCESS;

  constructor(public payload: WebNodeLog) {}
}

export class WebNodeSharedGetLogs implements WebNodeSharedAction {
  readonly type = WEB_NODE_SHARED_GET_LOGS;
}

export class WebNodeSharedGetLogsSuccess implements WebNodeSharedAction {
  readonly type = WEB_NODE_SHARED_GET_LOGS_SUCCESS;

  constructor(public payload: WebNodeLog) {}
}

export type WebNodeSharedActions =
  | WebNodeSharedInit
  | WebNodeSharedMarkAsOpened
  | WebNodeSharedGetPeers
  | WebNodeSharedGetPeersSuccess
  | WebNodeSharedGetLogs
  | WebNodeSharedGetLogsSuccess
  ;
