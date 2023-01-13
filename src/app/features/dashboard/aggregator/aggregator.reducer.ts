import { AggregatorState } from '@dashboard/aggregator/aggregator.state';
import {
  AGGREGATOR_CLOSE,
  AGGREGATOR_GET_MESSAGES_SUCCESS,
  AGGREGATOR_SET_ACTIVE_BLOCK,
  AGGREGATOR_SET_EARLIEST_BLOCK,
  AGGREGATOR_SORT,
  AGGREGATOR_TOGGLE_FILTER,
  AGGREGATOR_TOGGLE_SIDE_PANEL,
  AGGREGATOR_UPDATE_NODE_COUNT,
  AggregatorActions,
} from '@dashboard/aggregator/aggregator.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { DashboardMessage } from '@shared/types/dashboard/dashboard-message';
import { ONE_MILLION } from '@shared/constants/unit-measurements';

const initialState: AggregatorState = {
  messages: [],
  filteredMessages: [],
  stream: true,
  activeBlock: undefined,
  earliestBlock: undefined,
  sort: {
    sortBy: 'timestamp',
    sortDirection: SortDirection.ASC,
  },
  openSidePanel: false,
  allFilters: [],
  activeFilters: [],
  nodeCount: 0,
};

export function reducer(state: AggregatorState = initialState, action: AggregatorActions): AggregatorState {
  switch (action.type) {

    case AGGREGATOR_GET_MESSAGES_SUCCESS: {
      const messages = sortMessages(applyNewLatencies(action.payload), state.sort);
      return {
        ...state,
        messages,
        filteredMessages: state.activeFilters.length > 0 ? applyNewLatencies(getFilteredMessages(messages, state.activeFilters)) : getFilteredMessages(messages, state.activeFilters),
        allFilters: Array.from(new Set(action.payload.map(b => b.hash))),
      };
    }

    case AGGREGATOR_SET_ACTIVE_BLOCK: {
      return {
        ...state,
        activeBlock: action.payload.height,
        activeFilters: action.payload.fetchNew ? [] : state.activeFilters,
      };
    }

    case AGGREGATOR_SET_EARLIEST_BLOCK: {
      return {
        ...state,
        earliestBlock: action.payload.height,
      };
    }

    case AGGREGATOR_TOGGLE_SIDE_PANEL: {
      return {
        ...state,
        openSidePanel: !state.openSidePanel,
      };
    }

    case AGGREGATOR_SORT: {
      return {
        ...state,
        filteredMessages: sortMessages(state.filteredMessages, action.payload),
        sort: { ...action.payload },
      };
    }

    case AGGREGATOR_TOGGLE_FILTER: {
      const activeFilters = state.activeFilters.includes(action.payload)
        ? state.activeFilters.filter(f => f !== action.payload)
        : [...state.activeFilters, action.payload];

      const filteredMessages = getFilteredMessages(state.messages, activeFilters);

      return {
        ...state,
        activeFilters,
        filteredMessages: applyNewLatencies(sortMessages(filteredMessages, state.sort)),
      };
    }

    case AGGREGATOR_UPDATE_NODE_COUNT: {
      return action.payload === state.nodeCount ? state : {
        ...state,
        nodeCount: action.payload,
      };
    }

    case AGGREGATOR_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function getFilteredMessages(messages: DashboardMessage[], activeFilters: string[]): DashboardMessage[] {
  return activeFilters.length > 0 ? messages.filter(b => activeFilters.includes(b.hash)) : messages;
}

function sortMessages(messages: DashboardMessage[], tableSort: TableSort<DashboardMessage>): DashboardMessage[] {
  return sort<DashboardMessage>(messages, tableSort, ['hash', 'sourceAddr', 'destAddr', 'nodeAddr', 'debuggerName'], true);
}

function applyNewLatencies(messages: DashboardMessage[]): DashboardMessage[] {
  if (messages.length === 0) {
    return messages;
  }
  const fastestTime = Math.min(...messages.filter(m => m.timestamp !== -1).map(m => m.timestamp));
  return messages.map(m => ({
    ...m,
    blockLatency: m.timestamp === -1 ? undefined : (m.timestamp - fastestTime) / ONE_MILLION,
  }));
}
