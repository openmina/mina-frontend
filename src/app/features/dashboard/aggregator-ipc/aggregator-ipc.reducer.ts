import {
  AGGREGATOR_IPC_CLOSE,
  AGGREGATOR_IPC_GET_MESSAGES_SUCCESS,
  AGGREGATOR_IPC_SET_ACTIVE_BLOCK,
  AGGREGATOR_IPC_SET_EARLIEST_BLOCK,
  AGGREGATOR_IPC_SORT,
  AGGREGATOR_IPC_TOGGLE_FILTER,
  AGGREGATOR_IPC_UPDATE_NODE_COUNT,
  AggregatorIpcActions,
} from '@dashboard/aggregator-ipc/aggregator-ipc.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { AggregatorIpcState } from '@dashboard/aggregator-ipc/aggregator-ipc.state';
import { AggregatorIpc } from '@shared/types/dashboard/aggregator-ipc/aggregator-ipc.type';

const initialState: AggregatorIpcState = {
  messages: [],
  filteredMessages: [],
  stream: true,
  activeBlock: undefined,
  earliestBlock: undefined,
  sort: {
    sortBy: 'receiveTime',
    sortDirection: SortDirection.ASC,
  },
  allFilters: [],
  activeFilters: [],
  nodeCount: 0,
};

export function reducer(state: AggregatorIpcState = initialState, action: AggregatorIpcActions): AggregatorIpcState {
  switch (action.type) {

    case AGGREGATOR_IPC_GET_MESSAGES_SUCCESS: {
      const messages = sortMessages(action.payload, state.sort);
      return {
        ...state,
        messages,
        filteredMessages: getFilteredMessages(messages, state.activeFilters),
        allFilters: Array.from(new Set(action.payload.map(b => b.hash))),
      };
    }

    case AGGREGATOR_IPC_SET_ACTIVE_BLOCK: {
      return {
        ...state,
        activeBlock: action.payload.height,
        activeFilters: action.payload.fetchNew ? [] : state.activeFilters,
      };
    }

    case AGGREGATOR_IPC_SET_EARLIEST_BLOCK: {
      return {
        ...state,
        earliestBlock: action.payload.height,
      };
    }

    case AGGREGATOR_IPC_SORT: {
      return {
        ...state,
        filteredMessages: sortMessages(state.filteredMessages, action.payload),
        sort: { ...action.payload },
      };
    }

    case AGGREGATOR_IPC_TOGGLE_FILTER: {
      const activeFilters = state.activeFilters.includes(action.payload)
        ? state.activeFilters.filter(f => f !== action.payload)
        : [...state.activeFilters, action.payload];

      const filteredMessages = getFilteredMessages(state.messages, activeFilters);

      return {
        ...state,
        activeFilters,
        filteredMessages,
      };
    }

    case AGGREGATOR_IPC_UPDATE_NODE_COUNT: {
      return action.payload === state.nodeCount ? state : {
        ...state,
        nodeCount: action.payload,
      };
    }

    case AGGREGATOR_IPC_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function getFilteredMessages(messages: AggregatorIpc[], activeFilters: string[]): AggregatorIpc[] {
  return activeFilters.length > 0 ? messages.filter(b => activeFilters.includes(b.hash)) : messages;
}

function sortMessages(messages: AggregatorIpc[], tableSort: TableSort<AggregatorIpc>): AggregatorIpc[] {
  return sort<AggregatorIpc>(messages, tableSort, ['hash', 'messageSource', 'nodeAddress'], true);
}
