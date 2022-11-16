import { NetworkBlocksState } from '@network/blocks/network-blocks.state';
import { NETWORK_BLOCKS_CLOSE, NETWORK_BLOCKS_GET_BLOCKS_SUCCESS, NetworkBlocksActions } from '@network/blocks/network-blocks.actions';

const initialState: NetworkBlocksState = {
  blocks: [],
  stream: true,
  activeBlock: undefined,
};

export function reducer(state: NetworkBlocksState = initialState, action: NetworkBlocksActions): NetworkBlocksState {
  switch (action.type) {

    case NETWORK_BLOCKS_GET_BLOCKS_SUCCESS: {
      return {
        ...state,
        blocks: action.payload,
      };
    }

    case NETWORK_BLOCKS_CLOSE:
      return initialState;

    default:
      return state;
  }
}
