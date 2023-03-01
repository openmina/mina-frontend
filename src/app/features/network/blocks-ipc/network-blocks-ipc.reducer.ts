import {
  NETWORK_BLOCKS_IPC_CLOSE,
  NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS,
  NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK,
  NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK,
  NETWORK_BLOCKS_IPC_SORT,
  NETWORK_BLOCKS_IPC_TOGGLE_FILTER,
  NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL,
  NetworkBlocksIpcActions,
} from '@network/blocks-ipc/network-blocks-ipc.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { ONE_MILLION } from '@shared/constants/unit-measurements';
import { NetworkBlocksIpcState } from '@network/blocks-ipc/network-blocks-ipc.state';
import { NetworkBlockIpc } from '@shared/types/network/blocks-ipc/network-block-ipc.type';

const initialState: NetworkBlocksIpcState = {
  blocks: [],
  filteredBlocks: [],
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
};

export function reducer(state: NetworkBlocksIpcState = initialState, action: NetworkBlocksIpcActions): NetworkBlocksIpcState {

  switch (action.type) {

    case NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS: {
      const blocks = sortBlocks(action.payload, state.sort);
      const filteredBlocks = applyNewLatencies(getFilteredBlocks(blocks, state.activeFilters));
      return {
        ...state,
        blocks,
        filteredBlocks,
        allFilters: Array.from(new Set(action.payload.map(b => b.hash))),
      };
    }

    case NETWORK_BLOCKS_IPC_SORT: {
      return {
        ...state,
        filteredBlocks: sortBlocks(state.filteredBlocks, action.payload),
        sort: { ...action.payload },
      };
    }

    case NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL: {
      return {
        ...state,
        openSidePanel: !state.openSidePanel,
      };
    }

    case NETWORK_BLOCKS_IPC_TOGGLE_FILTER: {
      const activeFilters = state.activeFilters.includes(action.payload)
        ? state.activeFilters.filter(f => f !== action.payload)
        : [...state.activeFilters, action.payload];
      const filteredBlocks = getFilteredBlocks(state.blocks, activeFilters);
      return {
        ...state,
        activeFilters,
        filteredBlocks: applyNewLatencies(sortBlocks(filteredBlocks, state.sort)),
      };
    }

    case NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK: {
      return {
        ...state,
        activeBlock: action.payload.height,
        activeFilters: action.payload.fetchNew ? [] : state.activeFilters,
      };
    }

    case NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK: {
      return {
        ...state,
        earliestBlock: action.payload.height,
      };
    }

    case NETWORK_BLOCKS_IPC_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function getFilteredBlocks(allBlocks: NetworkBlockIpc[], activeFilters: string[]): NetworkBlockIpc[] {
  return activeFilters.length > 0 ? allBlocks.filter(b => activeFilters.includes(b.hash)) : allBlocks;
}

function sortBlocks(blocks: NetworkBlockIpc[], tableSort: TableSort<NetworkBlockIpc>): NetworkBlockIpc[] {
  return sort<NetworkBlockIpc>(blocks, tableSort, ['nodeAddress', 'hash', 'type', 'peerId', 'msgType', 'peerAddress']);
}

function applyNewLatencies(blocks: NetworkBlockIpc[]): NetworkBlockIpc[] {
  const fastestTime = Math.min(...blocks.map(b => b.timestamp));
  return blocks.map(b => ({
    ...b,
    blockLatency: (b.timestamp - fastestTime) / ONE_MILLION,
  }));
}
