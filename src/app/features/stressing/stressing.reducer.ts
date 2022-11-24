import { StressingState } from '@stressing/stressing.state';
import {
  STRESSING_CHANGE_TRANSACTION_BATCH, STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL,
  STRESSING_CLOSE,
  STRESSING_GET_TRANSACTIONS_SUCCESS,
  STRESSING_GET_WALLETS_SUCCESS,
  StressingActions,
} from '@stressing/stressing.actions';

const initialState: StressingState = {
  wallets: [],
  transactions: [],
  activeTransaction: undefined,
  intervalDuration: 10000,
  trSendingBatch: 1,
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
      return {
        ...state,
        transactions: action.payload.map(t => ({ ...t, isOurWallet: ourWallets.includes(t.from) || ourWallets.includes(t.to) })),
      };
    }

    case STRESSING_CHANGE_TRANSACTION_BATCH: {
      return {
        ...state,
        trSendingBatch: action.payload,
      };
    }

    case STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL: {
      return {
        ...state,
        intervalDuration: action.payload,
      };
    }

    case STRESSING_CLOSE:
      return initialState;

    default:
      return state;
  }
}
