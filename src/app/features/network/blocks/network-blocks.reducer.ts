import { NetworkBlocksState } from '@network/blocks/network-blocks.state';
import {
  NETWORK_BLOCKS_CLOSE,
  NETWORK_BLOCKS_GET_BLOCKS_SUCCESS,
  NETWORK_BLOCKS_SET_ACTIVE_BLOCK,
  NETWORK_BLOCKS_SORT,
  NETWORK_BLOCKS_TOGGLE_FILTER,
  NETWORK_BLOCKS_TOGGLE_SIDE_PANEL,
  NetworkBlocksActions,
} from '@network/blocks/network-blocks.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/sorting.helper';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';

const initialState: NetworkBlocksState = {
  blocks: [],
  filteredBlocks: [],
  stream: true,
  activeBlock: undefined,
  sort: {
    sortBy: 'messageId',
    sortDirection: SortDirection.ASC,
  },
  openSidePanel: true,
  allFilters: [],
  activeFilters: [],
};

export function reducer(state: NetworkBlocksState = initialState, action: NetworkBlocksActions): NetworkBlocksState {
  switch (action.type) {

    case NETWORK_BLOCKS_GET_BLOCKS_SUCCESS: {
      const blocks = sortBlocks(action.payload, state.sort);
      return {
        ...state,
        blocks,
        filteredBlocks: blocks,
        allFilters: Array.from(new Set(action.payload.map(b => b.hash))),
      };
    }

    case NETWORK_BLOCKS_SORT: {
      return {
        ...state,
        filteredBlocks: sortBlocks(state.filteredBlocks, action.payload),
        sort: { ...action.payload },
      };
    }

    case NETWORK_BLOCKS_TOGGLE_SIDE_PANEL: {
      return {
        ...state,
        openSidePanel: !state.openSidePanel,
      };
    }

    case NETWORK_BLOCKS_TOGGLE_FILTER: {
      const activeFilters = state.activeFilters.includes(action.payload)
        ? state.activeFilters.filter(f => f !== action.payload)
        : [...state.activeFilters, action.payload];
      return {
        ...state,
        activeFilters,
        filteredBlocks: activeFilters.length > 0 ? state.blocks.filter(b => activeFilters.includes(b.hash)) : state.blocks,
      };
    }

    case NETWORK_BLOCKS_SET_ACTIVE_BLOCK: {
      return {
        ...state,
        activeBlock: action.payload.height,
        activeFilters: action.payload.fetchNew ? [] : state.activeFilters,
      };
    }

    case NETWORK_BLOCKS_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortBlocks(blocks: NetworkBlock[], tableSort: TableSort): NetworkBlock[] {
  return sort<NetworkBlock>(blocks, tableSort, ['date', 'hash', 'sender', 'receiver', 'messageKind']);
}
