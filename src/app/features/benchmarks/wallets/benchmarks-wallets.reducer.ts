import {
  BENCHMARKS_WALLETS_CHANGE_FEE,
  BENCHMARKS_WALLETS_CHANGE_TRANSACTION_BATCH,
  BENCHMARKS_WALLETS_CLOSE,
  BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS_SUCCESS,
  BENCHMARKS_WALLETS_GET_WALLETS,
  BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS,
  BENCHMARKS_WALLETS_SELECT_WALLET,
  BENCHMARKS_WALLETS_SEND_TX_SUCCESS,
  BENCHMARKS_WALLETS_SEND_TXS,
  BENCHMARKS_WALLETS_TOGGLE_RANDOM_WALLET,
  BENCHMARKS_WALLETS_UPDATE_WALLETS_SUCCESS,
  BenchmarksWalletsActions,
} from '@benchmarks/wallets/benchmarks-wallets.actions';
import { BenchmarksWallet } from '@shared/types/benchmarks/wallets/benchmarks-wallet.type';
import { BenchmarksWalletTransaction } from '@shared/types/benchmarks/wallets/benchmarks-wallet-transaction.type';
import { ONE_BILLION } from '@shared/constants/unit-measurements';
import { BenchmarksWalletsState } from '@benchmarks/wallets/benchmarks-wallets.state';

const initialState: BenchmarksWalletsState = {
  wallets: [],
  mempoolTxs: [],
  txsToSend: [],
  blockSending: false,
  txSendingBatch: undefined,
  sentTransactions: {
    success: 0,
    fail: 0,
  },
  sentTxCount: 0,
  randomWallet: true,
  activeWallet: undefined,
  sendingFee: 1,
};

export function reducer(state: BenchmarksWalletsState = initialState, action: BenchmarksWalletsActions): BenchmarksWalletsState {
  switch (action.type) {

    case BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS: {
      return {
        ...state,
        wallets: action.payload,
        blockSending: false,
        txSendingBatch: state.txSendingBatch === undefined ? action.payload.length : state.txSendingBatch,
        activeWallet: action.payload[0],
      };
    }

    case BENCHMARKS_WALLETS_UPDATE_WALLETS_SUCCESS: {
      return {
        ...state,
        wallets: state.wallets.map((wallet: BenchmarksWallet, i: number) => ({
          ...wallet,
          ...action.payload[i],
        })),
      };
    }

    case BENCHMARKS_WALLETS_GET_MEMPOOL_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        mempoolTxs: action.payload,
        wallets: state.wallets.map((wallet: any) => {
          const txsInMempool = action.payload.filter(tx => tx.from === wallet.publicKey).map(tx => tx.nonce);
          const mempoolNonce = txsInMempool.length ? Math.max(...txsInMempool) : undefined;
          return ({ ...wallet, mempoolNonce });
        }),
      };
    }

    case BENCHMARKS_WALLETS_CHANGE_TRANSACTION_BATCH: {
      return {
        ...state,
        txSendingBatch: action.payload,
      };
    }

    case BENCHMARKS_WALLETS_GET_WALLETS: {
      return {
        ...state,
        blockSending: true,
      };
    }

    case BENCHMARKS_WALLETS_TOGGLE_RANDOM_WALLET: {
      return {
        ...state,
        randomWallet: !state.randomWallet,
      };
    }

    case BENCHMARKS_WALLETS_SEND_TXS: {
      let txsToSend: BenchmarksWalletTransaction[];
      if (state.randomWallet) {
        txsToSend = state.wallets
          .slice(0, state.txSendingBatch)
          .map((wallet: BenchmarksWallet, i: number) => {
            const nonce = getNonceForWallet(wallet, state).toString();
            const counter = state.sentTxCount + i;
            const memo = Date.now() + ',' + (counter + 1) + ',' + localStorage.getItem('browserId');
            const payment = {
              from: wallet.publicKey,
              nonce,
              to: getRandomReceiver(wallet, state.wallets),
              fee: (state.sendingFee * ONE_BILLION).toString(),
              amount: '2000000000',
              memo,
              validUntil: '4294967295',
            };

            return {
              ...payment,
              privateKey: wallet.privateKey,
            };
          });
      } else {
        const wallet = state.activeWallet;
        let nonce = getNonceForWallet(wallet, state);

        txsToSend = Array(state.txSendingBatch).fill(void 0).map((_, i: number) => {
          const counter = state.sentTxCount + i;
          const memo = Date.now() + ',' + (counter + 1) + ',' + localStorage.getItem('browserId');
          const payment = {
            from: wallet.publicKey,
            nonce: nonce.toString(),
            to: state.wallets[i].publicKey,
            fee: (state.sendingFee * ONE_BILLION).toString(),
            amount: '1000000000',
            memo,
            validUntil: '4294967295',
          };
          nonce++;

          return {
            ...payment,
            privateKey: wallet.privateKey,
          };
        });
      }

      return {
        ...state,
        txsToSend,
        wallets: state.wallets.map((w: BenchmarksWallet) => {
          if (!txsToSend.some(tx => tx.from === w.publicKey)) {
            return w;
          }
          return {
            ...w,
            lastTxStatus: 'sending',
          };
        }),
      };
    }

    case BENCHMARKS_WALLETS_SEND_TX_SUCCESS: {
      const from = action.payload.from || action.payload.error?.data.from;
      return {
        ...state,
        txsToSend: state.txsToSend.filter(tx => tx.from !== from),
        wallets: state.wallets.map((w: BenchmarksWallet) => {
          if (from !== w.publicKey) {
            return w;
          }
          if (action.payload.error) {
            return {
              ...w,
              lastTxStatus: 'error',
              failedTx: w.failedTx + 1,
              lastTxMemo: action.payload.error.data.memo,
              lastTxTime: action.payload.error.data.dateTime,
              errorReason: action.payload.error.message,
            };
          }
          return {
            ...w,
            lastTxStatus: 'generated',
            successTx: w.successTx + 1,
            lastTxMemo: action.payload.memo,
            lastTxTime: action.payload.dateTime,
          };
        }),
        sentTransactions: {
          success: state.sentTransactions.success + (!action.payload.error ? 1 : 0),
          fail: state.sentTransactions.fail + (action.payload.error ? 1 : 0),
        },
      };
    }

    case BENCHMARKS_WALLETS_SELECT_WALLET: {
      return {
        ...state,
        activeWallet: action.payload,
      };
    }

    case BENCHMARKS_WALLETS_CHANGE_FEE: {
      return {
        ...state,
        sendingFee: action.payload,
      };
    }

    case BENCHMARKS_WALLETS_CLOSE: {
      return {
        ...initialState,
        sentTxCount: state.sentTxCount,
      };
    }

    default:
      return state;
  }
}

function getRandomReceiver(currentWallet: BenchmarksWallet, wallets: BenchmarksWallet[]): string {
  const index = Math.floor(Math.random() * wallets.length);
  if (wallets[index].publicKey === currentWallet.publicKey) {
    return getRandomReceiver(currentWallet, wallets);
  }
  return wallets[index].publicKey;
}

function getNonceForWallet(wallet: BenchmarksWallet, state: BenchmarksWalletsState): number {
  const txsInMempool = state.mempoolTxs.filter(tx => tx.from === wallet.publicKey).map(tx => tx.nonce);
  return Math.max(wallet.nonce, txsInMempool.length ? (Math.max(...txsInMempool) + 1) : 0);
}
