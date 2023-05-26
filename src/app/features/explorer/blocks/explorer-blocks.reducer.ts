import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { ExplorerBlocksState } from '@explorer/blocks/explorer-blocks.state';
import {
  EXPLORER_BLOCKS_CLOSE,
  EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS, EXPLORER_BLOCKS_GET_TXS_SUCCESS, EXPLORER_BLOCKS_SET_ACTIVE_BLOCK,
  EXPLORER_BLOCKS_SORT,
  ExplorerBlocksActions,
} from '@explorer/blocks/explorer-blocks.actions';

const initialState: ExplorerBlocksState = {
  blocks: [],
  activeBlock: undefined,
  txs: [],
  zkApps: [],
  sort: {
    sortBy: 'timestamp',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: ExplorerBlocksState = initialState, action: ExplorerBlocksActions): ExplorerBlocksState {
  switch (action.type) {

    case EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS: {
      return {
        ...state,
        blocks: sortBlocks(action.payload, state.sort),
      };
    }

    case EXPLORER_BLOCKS_SORT: {
      return {
        ...state,
        sort: action.payload,
        blocks: sortBlocks(state.blocks, action.payload),
      };
    }

    case EXPLORER_BLOCKS_SET_ACTIVE_BLOCK: {
      return {
        ...state,
        activeBlock: action.payload,
        txs: [],
        zkApps: [],
      }
    }

    case EXPLORER_BLOCKS_GET_TXS_SUCCESS: {
      return {
        ...state,
        txs: action.payload[0],
        zkApps: action.payload[1],
      }
    }

    case EXPLORER_BLOCKS_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortBlocks(blocks: ExplorerBlock[], tableSort: TableSort<ExplorerBlock>): ExplorerBlock[] {
  return sort<ExplorerBlock>(blocks, tableSort, ['hash', 'stagedLedgerHash', 'snarkedLedgerHash']);
}
