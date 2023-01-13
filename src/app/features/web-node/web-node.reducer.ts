import { ActionReducer, combineReducers } from '@ngrx/store';
import { WebNodeSharedState, WebNodeState } from '@web-node/web-node.state';

import * as fromLogs from '@web-node/web-node-logs/web-node-logs.reducer';
import * as fromPeers from '@web-node/web-node-peers/web-node-peers.reducer';
import * as fromWallet from '@web-node/web-node-wallet/web-node-wallet.reducer';

import { WebNodeLogsAction, WebNodeLogsActions } from '@web-node/web-node-logs/web-node-logs.actions';
import { WebNodePeersAction, WebNodePeersActions } from '@web-node/web-node-peers/web-node-peers.actions';
import { WebNodeWalletAction, WebNodeWalletActions } from '@web-node/web-node-wallet/web-node-wallet.actions';
import {
  WEB_NODE_SHARED_GET_LOGS_SUCCESS,
  WEB_NODE_SHARED_GET_PEERS_SUCCESS,
  WEB_NODE_SHARED_MARK_AS_OPENED,
  WebNodeSharedAction,
  WebNodeSharedActions,
} from '@web-node/web-node.actions';
import { PEER_CONNECTED, PEER_DISCONNECTED } from '@web-node/web-node.service';

export type WebNodeActions = WebNodePeersActions & WebNodeLogsActions & WebNodeWalletActions & WebNodeSharedActions;
export type WebNodeAction = WebNodePeersAction & WebNodeLogsAction & WebNodeWalletAction & WebNodeSharedAction;

export const reducer: ActionReducer<WebNodeState, WebNodeActions> = combineReducers<WebNodeState, WebNodeActions>({
  peers: fromPeers.reducer,
  log: fromLogs.reducer,
  wallet: fromWallet.reducer,
  shared: sharedReducer,
});


const initialState: WebNodeSharedState = {
  peers: undefined,
  summary: undefined,
  logs: undefined,
  isOpen: false,
};

function sharedReducer(state: WebNodeSharedState = initialState, action: WebNodeSharedActions): WebNodeSharedState {
  switch (action.type) {

    case WEB_NODE_SHARED_MARK_AS_OPENED: {
      return {
        ...state,
        isOpen: true,
      };
    }

    case WEB_NODE_SHARED_GET_PEERS_SUCCESS: {
      return {
        ...state,
        peers: action.payload,
        summary: {
          ...state.summary,
          peers: action.payload.filter(p => p.kind === PEER_CONNECTED).length - action.payload.filter(p => p.kind === PEER_DISCONNECTED).length,
        },
      };
    }

    case WEB_NODE_SHARED_GET_LOGS_SUCCESS: {
      return {
        ...state,
        logs: action.payload,
        summary: {
          ...state.summary,
          messages: action.payload.filter(p => p.kind?.startsWith('P2pPubsub') || p.kind?.startsWith('P2pRpc')).length,
        },
      };
    }

    default:
      return state;
  }
}
