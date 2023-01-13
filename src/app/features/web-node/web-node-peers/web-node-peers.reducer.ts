import { WebNodePeersState } from '@web-node/web-node-peers/web-node-peers.state';
import { WEB_NODE_PEERS_CLOSE, WEB_NODE_PEERS_SELECT_PEER, WebNodePeersActions } from '@web-node/web-node-peers/web-node-peers.actions';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';

const initialState: WebNodePeersState = {
  activePeer: undefined,
};

export function reducer(state: WebNodePeersState = initialState, action: WebNodePeersActions): WebNodePeersState {
  switch (action.type) {

    case WEB_NODE_PEERS_SELECT_PEER: {
      const activePeer: WebNodeLog = !action.payload ? action.payload : {
        ...action.payload,
        data: {
          ...typeof action.payload.data === 'object' ? action.payload.data : JSON.parse(action.payload.data),
        },
      };
      if (action.payload?.data.message) {
        activePeer.data.message = JSON.parse(action.payload.data.message);
      }

      return {
        ...state,
        activePeer,
      };
    }

    case WEB_NODE_PEERS_CLOSE:
      return initialState;

    default:
      return state;
  }
}
