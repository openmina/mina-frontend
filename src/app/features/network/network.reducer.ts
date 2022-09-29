import { NetworkState } from '@network/network.state';
import {
  NETWORK_CHANGE_TAB,
  NETWORK_CLOSE,
  NETWORK_GET_CONNECTION_SUCCESS,
  NETWORK_GET_FULL_MESSAGE_SUCCESS,
  NETWORK_GET_MESSAGE_HEX_SUCCESS,
  NETWORK_GET_MESSAGES,
  NETWORK_GET_MESSAGES_SUCCESS,
  NETWORK_GET_PAGINATED_MESSAGES,
  NETWORK_GET_SPECIFIC_MESSAGE,
  NETWORK_GO_LIVE,
  NETWORK_INIT,
  NETWORK_PAUSE,
  NETWORK_SET_ACTIVE_ROW,
  NETWORK_SET_TIMESTAMP_INTERVAL,
  NETWORK_TOGGLE_FILTER,
  NetworkActions,
} from '@network/network.actions';
import { NetworkMessage } from '@shared/types/network/network-message.type';
import { VirtualScrollActivePage } from '@shared/types/shared/virtual-scroll-active-page.type';
import { NetworkMessagesDirection } from '@shared/types/network/network-messages-direction.enum';
import { NetworkFilter } from '@shared/types/network/network-filter.type';

const initialState: NetworkState = {
  messages: [],
  activeRow: undefined,
  activeRowFullMessage: undefined,
  activeRowHex: undefined,
  activeFilters: [],
  timestamp: undefined,
  stream: false,
  connection: undefined,
  limit: 1000,
  direction: NetworkMessagesDirection.REVERSE,
  activePage: {},
  pages: [],
  activeTab: 1,
};

export function reducer(state: NetworkState = initialState, action: NetworkActions): NetworkState {
  switch (action.type) {

    case NETWORK_GET_MESSAGES: {
      return {
        ...state,
        activePage: {
          ...state,
          firstPageIdWithFilters: null,
        },
      };
    }

    case NETWORK_GET_MESSAGES_SUCCESS: {
      const activePage = setActivePage(action.payload, state);
      let activeFilters = state.activeFilters;
      const index = activeFilters.findIndex(f => Number(f.value) === action.payload[0]?.connectionId);
      if (index !== -1) {
        activeFilters = activeFilters.map((filter: NetworkFilter, i: number) => {
          if (i === index) {
            return { ...filter, display: action.payload[0].address };
          }
          return filter;
        });
      }

      return {
        ...state,
        messages: action.payload,
        activePage,
        activeFilters: activeFilters,
        pages: setPages(activePage, state),
      };
    }

    case NETWORK_GET_FULL_MESSAGE_SUCCESS: {
      return {
        ...state,
        activeRowFullMessage: action.payload,
      };
    }

    case NETWORK_GET_MESSAGE_HEX_SUCCESS: {
      return {
        ...state,
        activeRowHex: action.payload,
      };
    }

    case NETWORK_GET_CONNECTION_SUCCESS: {
      return {
        ...state,
        connection: action.payload,
      };
    }

    case NETWORK_TOGGLE_FILTER:
    case NETWORK_GET_SPECIFIC_MESSAGE: {
      return {
        ...state,
        activeFilters: action.payload.type === 'add'
          ? [
            ...state.activeFilters,
            ...action.payload.filters.filter(f => !state.activeFilters.some(fi => fi.value === f.value)),
          ]
          : state.activeFilters.filter(f => !action.payload.filters.some(fi => fi.value === f.value)),
        stream: false,
        activePage: {
          ...state,
          firstPageIdWithFilters: null,
        },
        pages: [],
      };
    }

    case NETWORK_SET_ACTIVE_ROW: {
      return {
        ...state,
        activeRow: action.payload,
        activeRowFullMessage: undefined,
        activeRowHex: undefined,
        connection: undefined,
      };
    }

    case NETWORK_INIT:
    case NETWORK_GO_LIVE: {
      return {
        ...state,
        stream: true,
        activePage: {
          ...state.activePage,
          firstPageIdWithFilters: null,
        },
      };
    }

    case NETWORK_PAUSE: {
      return {
        ...state,
        stream: false,
      };
    }

    case NETWORK_GET_PAGINATED_MESSAGES: {
      return {
        ...state,
        stream: false,
        direction: action.payload.direction,
        activePage: {
          ...state.activePage,
          firstPageIdWithFilters: action.payload.id === 0 ? -1 : state.activePage.firstPageIdWithFilters,
        },
      };
    }

    case NETWORK_SET_TIMESTAMP_INTERVAL: {
      return {
        ...state,
        stream: false,
        timestamp: {
          from: action.payload.from,
          to: action.payload.to,
        },
        direction: action.payload.direction,
        activePage: {
          ...state,
          firstPageIdWithFilters: null,
        },
        pages: [],
      };
    }

    case NETWORK_CHANGE_TAB: {
      return {
        ...state,
        activeTab: action.payload,
      };
    }

    case NETWORK_CLOSE: {
      return initialState;
    }

    default:
      return state;
  }
}

function setActivePage(messages: NetworkMessage[], state: NetworkState): VirtualScrollActivePage<NetworkMessage> {
  if (!messages.length) {
    return {};
  }
  return {
    id: messages[messages.length - 1].id,
    start: messages[0],
    end: messages[messages.length - 1],
    numberOfRecords: messages.length,
    firstPageIdWithFilters: state.activePage.firstPageIdWithFilters === -1 ? messages[0].id : state.activePage.firstPageIdWithFilters,
  };
}

function setPages(activePage: VirtualScrollActivePage<NetworkMessage>, state: NetworkState): number[] {
  const currentPages = state.pages;

  if (currentPages.includes(activePage.id)) {
    return currentPages;
  }

  // if the new page is bigger than the biggest known page, we can reset
  if (activePage.id > currentPages[currentPages.length - 1]) {
    return [activePage.id];
  }

  return [...currentPages, activePage.id].sort((a, b) => a - b);
}
