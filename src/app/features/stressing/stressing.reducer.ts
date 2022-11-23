import { StressingState } from '@stressing/stressing.state';
import { STRESSING_CLOSE, STRESSING_GET_TRANSACTIONS_SUCCESS, STRESSING_GET_WALLETS_SUCCESS, StressingActions } from '@stressing/stressing.actions';

const initialState: StressingState = {
  wallets: [],
  transactions: [],
  activeTransaction: undefined,
  intervalDuration: 10000,
  trSendingBatch: 5,
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
      return {
        ...state,
        transactions: action.payload,
      };
    }

    case STRESSING_CLOSE:
      return initialState;

    default:
      return state;
  }
}
