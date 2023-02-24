import { TracingBlocksState } from '@tracing/tracing-blocks/tracing-blocks.state';
import {
  TRACING_BLOCKS_CLOSE,
  TRACING_BLOCKS_GET_DETAILS_SUCCESS, TRACING_BLOCKS_GET_TRACES,
  TRACING_BLOCKS_GET_TRACES_SUCCESS,
  TRACING_BLOCKS_SELECT_ROW,
  TRACING_BLOCKS_SORT,
  TracingBlocksActions,
} from '@tracing/tracing-blocks/tracing-blocks.actions';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';

const initialState: TracingBlocksState = {
  traces: undefined,
  activeTrace: undefined,
  activeTraceGroups: [],
  sort: {
    sortBy: 'height',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: TracingBlocksState = initialState, action: TracingBlocksActions): TracingBlocksState {
  switch (action.type) {

    case TRACING_BLOCKS_GET_TRACES: {
      return {
        ...state,
        activeTrace: undefined,
      }
    }

    case TRACING_BLOCKS_GET_TRACES_SUCCESS: {
      return {
        ...state,
        traces: sortTraces(action.payload, state.sort),
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

    case TRACING_BLOCKS_SORT: {
      return {
        ...state,
        traces: sortTraces(state.traces, action.payload),
        sort: { ...action.payload },
      };
    }

    case TRACING_BLOCKS_CLOSE: {
      return initialState;
    }

    default:
      return state;
  }
}

function sortTraces(blocks: TracingBlockTrace[], tableSort: TableSort<TracingBlockTrace>): TracingBlockTrace[] {
  return sort(blocks, tableSort, ['source', 'hash', 'status', 'creator']);
}
