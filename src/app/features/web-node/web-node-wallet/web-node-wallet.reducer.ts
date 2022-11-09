import {
  WEB_NODE_WALLET_CHANGE_WALLET,
  WEB_NODE_WALLET_CLOSE,
  WEB_NODE_WALLET_GET_TRANSACTIONS_STATUSES_SUCCESS,
  WEB_NODE_WALLET_GET_TRANSACTIONS_SUCCESS,
  WEB_NODE_WALLET_GET_WALLETS_SUCCESS,
  WEB_NODE_WALLET_SELECT_TRANSACTION,
  WebNodeWalletActions,
} from '@web-node/web-node-wallet/web-node-wallet.actions';
import { WebNodeWalletState } from '@web-node/web-node-wallet/web-node-wallet.state';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';

const initialState: WebNodeWalletState = {
  wallets: [],
  activeWallet: undefined,
  transactions: [],
  activeTransaction: undefined,
};

export function reducer(state: WebNodeWalletState = initialState, action: WebNodeWalletActions): WebNodeWalletState {
  switch (action.type) {

    case WEB_NODE_WALLET_GET_WALLETS_SUCCESS: {
      return {
        ...state,
        wallets: action.payload,
        activeWallet: state.activeWallet ?? action.payload[0],
      };
    }

    case WEB_NODE_WALLET_CHANGE_WALLET: {
      return {
        ...state,
        activeWallet: action.payload,
        transactions: [],
      };
    }

    case WEB_NODE_WALLET_GET_TRANSACTIONS_SUCCESS: {
      let success: WebNodeTransaction[] = [];
      let pending: WebNodeTransaction[] = [];
      action.payload.forEach((transaction: WebNodeTransaction) => {
        (transaction.isInMempool ? pending : success).push(transaction);
      });
      return {
        ...state,
        transactions: [
          ...pending.filter(pt => !state.transactions.some(t => t.id === pt.id)),
          ...state.transactions.filter(t => t.isInMempool && !success.some(st => st.id === t.id)),
          ...success,
        ],
      };
    }

    case WEB_NODE_WALLET_GET_TRANSACTIONS_STATUSES_SUCCESS: {
      return {
        ...state,
        transactions: state.transactions.map((t: WebNodeTransaction) => {
          if (action.payload[t.id]) {
            return { ...t, status: action.payload[t.id] };
          }
          return t;
        }),
      };
    }

    case WEB_NODE_WALLET_SELECT_TRANSACTION: {
      return {
        ...state,
        activeTransaction: action.payload,
      };
    }

    case WEB_NODE_WALLET_CLOSE:
      return initialState;

    default:
      return state;
  }
}
