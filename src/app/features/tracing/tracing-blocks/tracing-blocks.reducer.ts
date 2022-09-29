import { TracingBlocksState } from '@tracing/tracing-blocks/tracing-blocks.state';
import {
  TRACING_BLOCKS_CLOSE,
  TRACING_BLOCKS_GET_DETAILS_SUCCESS,
  TRACING_BLOCKS_GET_TRACES_SUCCESS,
  TRACING_BLOCKS_SELECT_ROW,
  TracingBlocksActions,
} from '@tracing/tracing-blocks/tracing-blocks.actions';

const initialState: TracingBlocksState = {
  traces: [],
  activeTrace: undefined,
  activeTraceGroups: [],
};

export function reducer(state: TracingBlocksState = initialState, action: TracingBlocksActions): TracingBlocksState {
  switch (action.type) {

    case TRACING_BLOCKS_GET_TRACES_SUCCESS: {
      return {
        ...state,
        traces: action.payload,
      };
    }

    case TRACING_BLOCKS_GET_DETAILS_SUCCESS: {
      return {
        ...state,
        activeTraceGroups: action.payload,
      };
    }

    case TRACING_BLOCKS_SELECT_ROW: {
      return {
        ...state,
        activeTrace: action.payload,
      };
    }

    case TRACING_BLOCKS_CLOSE: {
      return initialState;
    }

    default:
      return state;
  }
}
