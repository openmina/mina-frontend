import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { lastItem, sort } from '@shared/helpers/array.helper';
import { isDesktop } from '@shared/helpers/values.helper';
import { DswLiveState } from '@dsw/live/dsw-live.state';
import {
  DSW_LIVE_CLOSE,
  DSW_LIVE_GET_NODES_SUCCESS,
  DSW_LIVE_SET_ACTIVE_NODE,
  DSW_LIVE_SORT_EVENTS,
  DSW_LIVE_TOGGLE_SIDE_PANEL,
  DswLiveActions,
} from '@dsw/live/dsw-live.actions';
import { DswLiveBlockEvent } from '@shared/types/dsw/live/dsw-live-block-event.type';

const initialState: DswLiveState = {
  nodes: [],
  activeNode: undefined,
  openSidePanel: isDesktop(),
  sort: {
    sortBy: 'timestamp',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: DswLiveState = initialState, action: DswLiveActions): DswLiveState {
  switch (action.type) {

    case DSW_LIVE_GET_NODES_SUCCESS: {
      return {
        ...state,
        nodes: action.payload,
        activeNode: state.activeNode ? action.payload.find(node => node.bestTip === state.activeNode.bestTip) : lastItem(action.payload),
      };
    }

    case DSW_LIVE_SET_ACTIVE_NODE: {
      return {
        ...state,
        activeNode: state.nodes.find(node => node.bestTip === action.payload.hash),
      };
    }

    case DSW_LIVE_SORT_EVENTS: {
      return {
        ...state,
        sort: action.payload, //todo: add sorting
        // nodes: sortNodes(state.nodes, action.payload),
      };
    }

    case DSW_LIVE_TOGGLE_SIDE_PANEL: {
      return {
        ...state,
        openSidePanel: !state.openSidePanel,
        activeNode: state.openSidePanel ? undefined : state.activeNode,
      };
    }

    case DSW_LIVE_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortEvents(event: DswLiveBlockEvent[], tableSort: TableSort<DswLiveBlockEvent>): DswLiveBlockEvent[] {
  return sort<DswLiveBlockEvent>(event, tableSort, ['message', 'status']);
}
