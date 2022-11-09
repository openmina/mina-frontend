import { WebNodePeersState } from '@web-node/web-node-peers/web-node-peers.state';
import { WEB_NODE_PEERS_CLOSE, WEB_NODE_PEERS_SELECT_PEER, WebNodePeersActions } from '@web-node/web-node-peers/web-node-peers.actions';

const initialState: WebNodePeersState = {
  activePeer: undefined,
};

export function reducer(state: WebNodePeersState = initialState, action: WebNodePeersActions): WebNodePeersState {
  switch (action.type) {

    case WEB_NODE_PEERS_SELECT_PEER: {
      return {
        ...state,
        activePeer: action.payload,
      };
    }

    case WEB_NODE_PEERS_CLOSE:
      return initialState;

    default:
      return state;
  }
}
