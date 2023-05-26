import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { ExplorerSnarksState } from '@explorer/snarks/explorer-snarks.state';
import {
  EXPLORER_SNARKS_CLOSE,
  EXPLORER_SNARKS_GET_SNARKS_SUCCESS, EXPLORER_SNARKS_SET_ACTIVE_SNARK,
  EXPLORER_SNARKS_SORT,
  ExplorerSnarksActions,
} from '@explorer/snarks/explorer-snarks.actions';
import { ExplorerSnark } from '@shared/types/explorer/snarks/explorer-snarks.type';

const initialState: ExplorerSnarksState = {
  snarks: [],
  activeSnark: undefined,
  sort: {
    sortBy: 'prover',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: ExplorerSnarksState = initialState, action: ExplorerSnarksActions): ExplorerSnarksState {
  switch (action.type) {

    case EXPLORER_SNARKS_GET_SNARKS_SUCCESS: {
      return {
        ...state,
        snarks: sortTxs(action.payload, state.sort),
      };
    }

    case EXPLORER_SNARKS_SORT: {
      return {
        ...state,
        sort: action.payload,
        snarks: sortTxs(state.snarks, action.payload),
      };
    }

    case EXPLORER_SNARKS_SET_ACTIVE_SNARK: {
      return {
        ...state,
        activeSnark: action.payload,
      }
    }

    case EXPLORER_SNARKS_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortTxs(snarks: ExplorerSnark[], tableSort: TableSort<ExplorerSnark>): ExplorerSnark[] {
  return sort<ExplorerSnark>(snarks, tableSort, ['prover', 'fee', 'workIds']);
}
