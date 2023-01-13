import { ExplorerScanState } from '@explorer/scan-state/explorer-scan-state.state';
import {
  EXPLORER_SCAN_STATE_CLOSE,
  EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS,
  EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK,
  EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK, EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING,
  ExplorerScanStateActions,
} from '@explorer/scan-state/explorer-scan-state.actions';

const initialState: ExplorerScanState = {
  scanState: [],
  activeBlock: undefined,
  earliestBlock: undefined,
  firstBlock: undefined,
  txCount: 0,
  snarksCount: 0,
  leafsMarking: false,
};

export function reducer(state: ExplorerScanState = initialState, action: ExplorerScanStateActions): ExplorerScanState {
  switch (action.type) {

    case EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS: {
      return {
        ...state,
        scanState: action.payload.scanState,
        txCount: action.payload.txCount ?? state.txCount,
        snarksCount: action.payload.snarksCount ?? state.snarksCount,
        firstBlock: action.payload.firstBlock ?? state.firstBlock,
      };
    }
    case EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK: {
      return {
        ...state,
        activeBlock: action.payload.height,
      };
    }

    case EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK: {
      return {
        ...state,
        earliestBlock: action.payload.height,
      };
    }

    case EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING: {
      return {
        ...state,
        leafsMarking: !state.leafsMarking,
      };
    }

    case EXPLORER_SCAN_STATE_CLOSE:
      return initialState;

    default:
      return state;
  }
}
