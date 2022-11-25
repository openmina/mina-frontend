import { StressingState } from '@stressing/stressing.state';
import {
  STRESSING_CHANGE_TRANSACTION_BATCH,
  STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL,
  STRESSING_CLOSE,
  STRESSING_GET_TRANSACTIONS_STATUSES_SUCCESS,
  STRESSING_GET_TRANSACTIONS_SUCCESS,
  STRESSING_GET_WALLETS_SUCCESS,
  STRESSING_CREATE_TRANSACTION_SUCCESS,
  STRESSING_STREAM_SENDING_LIVE,
  STRESSING_STREAM_SENDING_PAUSE,
  STRESSING_TOGGLE_FILTER_TRANSACTIONS,
  StressingActions,
} from '@stressing/stressing.actions';
import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';

const initialState: StressingState = {
  wallets: [],
  transactions: [],
  filteredTransactions: [],
  activeTransaction: undefined,
  intervalDuration: 10,
  trSendingBatch: 1,
  streamSending: false,
  filters: [],
  sentTransactions: {
    success: 0,
    fail: 0,
  },
};

export function reducer(state: StressingState = initialState, action: StressingActions): StressingState {
  switch (action.type) {

    case STRESSING_GET_WALLETS_SUCCESS: {
      return {
        ...state,
        wallets: action.payload,
      };
    }

    case STRESSING_GET_TRANSACTIONS_SUCCESS: {
      const ourWallets = state.wallets.map(w => w.publicKey);
      const transactions = action.payload.map(t => ({ ...t, isOurWallet: ourWallets.includes(t.from) || ourWallets.includes(t.to) }));
      return {
        ...state,
        transactions,
        filteredTransactions: getFilteredTransactions(transactions, state.filters),
      };
    }

    case STRESSING_CHANGE_TRANSACTION_BATCH: {
      return {
        ...state,
        trSendingBatch: action.payload,
        streamSending: true,
      };
    }

    case STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL: {
      return {
        ...state,
        intervalDuration: action.payload,
        streamSending: true,
      };
    }

    case STRESSING_GET_TRANSACTIONS_STATUSES_SUCCESS: {
      const transactions = state.transactions.map((t: StressingTransaction) => {
        if (action.payload[t.id]) {
          return { ...t, status: action.payload[t.id] };
        }
        return t;
      });
      return {
        ...state,
        transactions,
        filteredTransactions: getFilteredTransactions(transactions, state.filters),
      };
    }

    case STRESSING_STREAM_SENDING_LIVE: {
      return {
        ...state,
        streamSending: true,
      };
    }

    case STRESSING_STREAM_SENDING_PAUSE: {
      return {
        ...state,
        streamSending: false,
      };
    }

    case STRESSING_CREATE_TRANSACTION_SUCCESS: {
      return {
        ...state,
        sentTransactions: {
          success: state.sentTransactions.success + action.payload.success,
          fail: state.sentTransactions.fail + action.payload.fail,
        },
      };
    }

    case STRESSING_TOGGLE_FILTER_TRANSACTIONS: {
      const filters = state.filters.includes(action.payload)
        ? state.filters.filter(f => f !== action.payload)
        : [...state.filters, action.payload];
      return {
        ...state,
        filters,
        filteredTransactions: getFilteredTransactions(state.transactions, filters),
      };
    }

    case STRESSING_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function getFilteredTransactions(allTransactions: StressingTransaction[], activeFilters: boolean[]): StressingTransaction[] {
  return activeFilters.length > 0 ? allTransactions.filter(b => activeFilters.includes(b.isOurWallet)) : allTransactions;
}
