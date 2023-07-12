import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { DswBootstrapState } from '@dsw/bootstrap/dsw-bootstrap.state';
import {
  DSW_BOOTSTRAP_CLOSE,
  DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS,
  DSW_BOOTSTRAP_SET_ACTIVE_BLOCK,
  DSW_BOOTSTRAP_SORT_BLOCKS, DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL,
  DswBootstrapActions,
} from '@dsw/bootstrap/dsw-bootstrap.actions';
import { DswBootstrapNode } from '@shared/types/dsw/bootstrap/dsw-bootstrap-node.type';
import { isDesktop } from '@shared/helpers/values.helper';

const initialState: DswBootstrapState = {
  nodes: [],
  activeNode: undefined,
  openSidePanel: isDesktop(),
  sort: {
    sortBy: 'index',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: DswBootstrapState = initialState, action: DswBootstrapActions): DswBootstrapState {
  switch (action.type) {

    case DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS: {
      return {
        ...state,
        nodes: sortNodes(action.payload, state.sort),
        activeNode: state.activeNode ? action.payload.find(node => node.index === state.activeNode.index) : undefined,
      };
    }

    case DSW_BOOTSTRAP_SET_ACTIVE_BLOCK: {
      return {
        ...state,
        activeNode: action.payload,
        openSidePanel: action.payload ? true : state.openSidePanel,
      };
    }

    case DSW_BOOTSTRAP_SORT_BLOCKS: {
      return {
        ...state,
        sort: action.payload,
        nodes: sortNodes(state.nodes, action.payload),
      };
    }

    case DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL: {
      return {
        ...state,
        openSidePanel: !state.openSidePanel,
        activeNode: state.openSidePanel ? undefined : state.activeNode,
      }
    }

    case DSW_BOOTSTRAP_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortNodes(node: DswBootstrapNode[], tableSort: TableSort<DswBootstrapNode>): DswBootstrapNode[] {
  return sort<DswBootstrapNode>(node, tableSort, ['bestTip']);
}
