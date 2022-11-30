import { NetworkGlobalState } from '@network/global/network-global.state';
import {
  NETWORK_GLOBAL_CLOSE,
  NETWORK_GLOBAL_GET_GLOBAL_SUCCESS,
  NETWORK_GLOBAL_GO_LIVE,
  NETWORK_GLOBAL_INIT,
  NETWORK_GLOBAL_PAUSE,
  NETWORK_GLOBAL_SELECT_GLOBAL,
  NetworkGlobalActions,
} from '@network/global/network-global.actions';

const initialState: NetworkGlobalState = {
  globalMessages: [],
  activeGlobalMessage: undefined,
  stream: true,
};

export function reducer(state: NetworkGlobalState = initialState, action: NetworkGlobalActions): NetworkGlobalState {
  switch (action.type) {

    case NETWORK_GLOBAL_GET_GLOBAL_SUCCESS: {
      return {
        ...state,
        globalMessages: action.payload,
      };
    }

    case NETWORK_GLOBAL_SELECT_GLOBAL: {
      return {
        ...state,
        activeGlobalMessage: action.payload,
      };
    }

    case NETWORK_GLOBAL_INIT:
    case NETWORK_GLOBAL_GO_LIVE: {
      return {
        ...state,
        stream: true,
      };
    }

    case NETWORK_GLOBAL_PAUSE: {
      return {
        ...state,
        stream: false,
      };
    }

    case NETWORK_GLOBAL_CLOSE:
      return initialState;

    default:
      return state;
  }
}
