import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { DswBootstrapState } from '@dsw/bootstrap/dsw-bootstrap.state';
import {
  DSW_BOOTSTRAP_CLOSE,
  DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS,
  DSW_BOOTSTRAP_SET_ACTIVE_BLOCK,
  DSW_BOOTSTRAP_SORT_BLOCKS,
  DswBootstrapActions,
} from '@dsw/bootstrap/dsw-bootstrap.actions';
import { DswDashboardBlock } from '@shared/types/dsw/dashboard/dsw-dashboard-block.type';

const initialState: DswBootstrapState = {
  node: undefined,
  activeBlock: undefined,
  sort: {
    sortBy: 'height',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: DswBootstrapState = initialState, action: DswBootstrapActions): DswBootstrapState {
  switch (action.type) {

    case DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS: {
      return {
        ...state,
        node: {
          ...action.payload,
          blocks: sortBlocks(action.payload.blocks, state.sort),
        },
      };
    }

    case DSW_BOOTSTRAP_SET_ACTIVE_BLOCK: {
      return {
        ...state,
        activeBlock: action.payload,
      };
    }

    case DSW_BOOTSTRAP_SORT_BLOCKS: {
      return {
        ...state,
        sort: action.payload,
        node: {
          ...state.node,
          blocks: sortBlocks(state.node.blocks, action.payload),
        },
      };
    }

    case DSW_BOOTSTRAP_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortBlocks(node: DswDashboardBlock[], tableSort: TableSort<DswDashboardBlock>): DswDashboardBlock[] {
  return sort<DswDashboardBlock>(node, tableSort, ['status']);
}
