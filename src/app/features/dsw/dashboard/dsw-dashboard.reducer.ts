import { DswDashboardState } from '@dsw/dashboard/dsw-dashboard.state';
import {
  DSW_DASHBOARD_CLOSE,
  DSW_DASHBOARD_GET_NODES_SUCCESS,
  DSW_DASHBOARD_SET_ACTIVE_NODE,
  DSW_DASHBOARD_SORT_NODES,
  DswDashboardActions,
} from '@dsw/dashboard/dsw-dashboard.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';

const initialState: DswDashboardState = {
  nodes: [],
  activeNode: undefined,
  sort: {
    sortBy: 'kind',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: DswDashboardState = initialState, action: DswDashboardActions): DswDashboardState {
  switch (action.type) {

    case DSW_DASHBOARD_GET_NODES_SUCCESS: {
      return {
        ...state,
        nodes: sortNodes(action.payload, state.sort),
        activeNode: state.activeNode ? action.payload.find(node => node.name === state.activeNode.name) : undefined,
      };
    }

    case DSW_DASHBOARD_SORT_NODES: {
      return {
        ...state,
        sort: action.payload,
        nodes: sortNodes(state.nodes, action.payload),
      };
    }

    case DSW_DASHBOARD_SET_ACTIVE_NODE: {
      return {
        ...state,
        activeNode: action.payload,
      };
    }

    case DSW_DASHBOARD_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortNodes(node: DswDashboardNode[], tableSort: TableSort<DswDashboardNode>): DswDashboardNode[] {
  return sort<DswDashboardNode>(node, tableSort, ['kind', 'name', 'bestTip',]);
}
