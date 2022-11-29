import { NetworkTransactionsState } from '@network/transactions/network-transactions.state';
import {
  NETWORK_TRANSACTIONS_CLOSE,
  NETWORK_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS,
  NETWORK_TRANSACTIONS_GO_LIVE,
  NETWORK_TRANSACTIONS_INIT,
  NETWORK_TRANSACTIONS_PAUSE,
  NETWORK_TRANSACTIONS_SELECT_TRANSACTION,
  NetworkTransactionsActions,
} from '@network/transactions/network-transactions.actions';

const initialState: NetworkTransactionsState = {
  transactions: [],
  activeTransaction: undefined,
  stream: true,
};

export function reducer(state: NetworkTransactionsState = initialState, action: NetworkTransactionsActions): NetworkTransactionsState {
  switch (action.type) {

    case NETWORK_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        transactions: action.payload,
      };
    }

    case NETWORK_TRANSACTIONS_SELECT_TRANSACTION: {
      return {
        ...state,
        activeTransaction: action.payload,
      };
    }

    case NETWORK_TRANSACTIONS_INIT:
    case NETWORK_TRANSACTIONS_GO_LIVE: {
      return {
        ...state,
        stream: true,
      };
    }

    case NETWORK_TRANSACTIONS_PAUSE: {
      return {
        ...state,
        stream: false,
      };
    }

    case NETWORK_TRANSACTIONS_CLOSE:
      return initialState;

    default:
      return state;
  }
}
