import { FeatureAction } from '@shared/types/store/feature-action.type';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';

enum WebNodePeersActionsTypes {
  WEB_NODE_PEERS_SELECT_PEER = 'WEB_NODE_PEERS_SELECT_PEER',
  WEB_NODE_PEERS_CLOSE = 'WEB_NODE_PEERS_CLOSE',
}

export const WEB_NODE_PEERS_SELECT_PEER = WebNodePeersActionsTypes.WEB_NODE_PEERS_SELECT_PEER;
export const WEB_NODE_PEERS_CLOSE = WebNodePeersActionsTypes.WEB_NODE_PEERS_CLOSE;

export interface WebNodePeersAction extends FeatureAction<WebNodePeersActionsTypes> {
  readonly type: WebNodePeersActionsTypes;
}

export class WebNodePeersSelectPeer implements WebNodePeersAction {
  readonly type = WEB_NODE_PEERS_SELECT_PEER;

  constructor(public payload: WebNodeLog) {}
}

export class WebNodePeersClose implements WebNodePeersAction {
  readonly type = WEB_NODE_PEERS_CLOSE;
}

export type WebNodePeersActions =
  | WebNodePeersSelectPeer
  | WebNodePeersClose
  ;
