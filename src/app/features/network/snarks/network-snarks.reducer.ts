import { NetworkSnarksState } from '@network/snarks/network-snarks.state';
import {
  NETWORK_SNARKS_CLOSE,
  NETWORK_SNARKS_GET_SNARKS_SUCCESS,
  NETWORK_SNARKS_GO_LIVE,
  NETWORK_SNARKS_INIT,
  NETWORK_SNARKS_PAUSE,
  NETWORK_SNARKS_SELECT_SNARK,
  NetworkSnarksActions,
} from '@network/snarks/network-snarks.actions';

const initialState: NetworkSnarksState = {
  snarks: [],
  activeSnark: undefined,
  stream: true,
};

export function reducer(state: NetworkSnarksState = initialState, action: NetworkSnarksActions): NetworkSnarksState {
  switch (action.type) {

    case NETWORK_SNARKS_GET_SNARKS_SUCCESS: {
      return {
        ...state,
        snarks: action.payload,
      };
    }

    case NETWORK_SNARKS_SELECT_SNARK: {
      return {
        ...state,
        activeSnark: action.payload,
      };
    }

    case NETWORK_SNARKS_INIT:
    case NETWORK_SNARKS_GO_LIVE: {
      return {
        ...state,
        stream: true,
      };
    }

    case NETWORK_SNARKS_PAUSE: {
      return {
        ...state,
        stream: false,
      };
    }

    case NETWORK_SNARKS_CLOSE:
      return initialState;

    default:
      return state;
  }
}
