import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import {
  EXPLORER_TRANSACTIONS_CLOSE,
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS,
  EXPLORER_TRANSACTIONS_SORT,
  ExplorerTransactionsActions,
} from '@explorer/transactions/explorer-transactions.actions';
import { ExplorerTransactionsState } from '@explorer/transactions/explorer-transactions.state';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';

const initialState: ExplorerTransactionsState = {
  transactions: [],
  sort: {
    sortBy: 'id',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: ExplorerTransactionsState = initialState, action: ExplorerTransactionsActions): ExplorerTransactionsState {
  switch (action.type) {

    case EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        transactions: sortTxs(action.payload, state.sort),
      };
    }

    case EXPLORER_TRANSACTIONS_SORT: {
      return {
        ...state,
        sort: action.payload,
        transactions: sortTxs(state.transactions, action.payload),
      };
    }

    case EXPLORER_TRANSACTIONS_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortTxs(blocks: ExplorerTransaction[], tableSort: TableSort<ExplorerTransaction>): ExplorerTransaction[] {
  return sort<ExplorerTransaction>(blocks, tableSort, ['id', 'to', 'fee', 'memo', 'from', 'kind', 'status']);
}
