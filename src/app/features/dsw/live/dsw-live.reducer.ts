import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { lastItem, sort, toggleItem } from '@shared/helpers/array.helper';
import { isDesktop } from '@shared/helpers/values.helper';
import { DswLiveState } from '@dsw/live/dsw-live.state';
import {
  DSW_LIVE_CLOSE,
  DSW_LIVE_GET_NODES_SUCCESS,
  DSW_LIVE_SET_ACTIVE_NODE,
  DSW_LIVE_SORT_EVENTS, DSW_LIVE_TOGGLE_FILTER,
  DSW_LIVE_TOGGLE_SIDE_PANEL,
  DswLiveActions,
} from '@dsw/live/dsw-live.actions';
import { DswLiveBlockEvent } from '@shared/types/dsw/live/dsw-live-block-event.type';
import { DswDashboardNodeBlockStatus } from '@shared/types/dsw/dashboard/dsw-dashboard-block.type';

const initialState: DswLiveState = {
  nodes: [],
  activeNode: undefined,
  openSidePanel: isDesktop(),
  sort: {
    sortBy: 'timestamp',
    sortDirection: SortDirection.DSC,
  },
  filteredEvents: [],
  filters: [],
};

export function reducer(state: DswLiveState = initialState, action: DswLiveActions): DswLiveState {
  switch (action.type) {

    case DSW_LIVE_GET_NODES_SUCCESS: {
      let activeNode = state.activeNode ? action.payload.find(node => node.bestTip === state.activeNode.bestTip) : lastItem(action.payload);
      return {
        ...state,
        nodes: action.payload,
        activeNode,
        filteredEvents: filterEvents(sortEvents(activeNode.events, state.sort), state.filters),
      };
    }

    case DSW_LIVE_SET_ACTIVE_NODE: {
      let activeNode = state.nodes.find(node => node.bestTip === action.payload.hash);
      if (!activeNode) {
        return state;
      }
      return {
        ...state,
        activeNode,
        filteredEvents: filterEvents(sortEvents(activeNode.events, state.sort), state.filters),
      };
    }

    case DSW_LIVE_SORT_EVENTS: {
      return {
        ...state,
        sort: action.payload,
        filteredEvents: filterEvents(sortEvents(state.activeNode.events, action.payload), state.filters),
      };
    }

    case DSW_LIVE_TOGGLE_SIDE_PANEL: {
      return {
        ...state,
        openSidePanel: !state.openSidePanel,
        activeNode: state.openSidePanel ? undefined : state.activeNode,
      };
    }

    case DSW_LIVE_TOGGLE_FILTER: {
      const filters = toggleItem(state.filters, action.payload);
      return {
        ...state,
        filters,
        filteredEvents: filterEvents(sortEvents(state.activeNode.events, state.sort), filters),
      }
    }

    case DSW_LIVE_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortEvents(events: DswLiveBlockEvent[], tableSort: TableSort<DswLiveBlockEvent>): DswLiveBlockEvent[] {
  return sort<DswLiveBlockEvent>(events, tableSort, ['message', 'status']);
}

function filterEvents(events: DswLiveBlockEvent[], filters: string[]): DswLiveBlockEvent[] {
  if (!filters.length) {
    return events;
  }
  if (filters.includes('best tip')) {
    events = events.filter(event => event.isBestTip);
  }

  if (filters.some(f => Object.values(DswDashboardNodeBlockStatus).includes(f as DswDashboardNodeBlockStatus))) {
    events = events.filter(event => filters.includes(event.message));
  }

  return events;
}