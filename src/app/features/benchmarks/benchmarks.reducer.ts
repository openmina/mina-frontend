import { BenchmarksState } from '@benchmarks/benchmarks.state';
import {
  BENCHMARKS_CHANGE_TRANSACTION_BATCH,
  BENCHMARKS_CLOSE,
  BENCHMARKS_GET_MEMPOOL_TRANSACTIONS_SUCCESS,
  BENCHMARKS_GET_WALLETS,
  BENCHMARKS_GET_WALLETS_SUCCESS,
  BENCHMARKS_SEND_TX_SUCCESS,
  BENCHMARKS_SEND_TXS,
  BENCHMARKS_UPDATE_WALLETS_SUCCESS,
  BenchmarksActions,
} from '@benchmarks/benchmarks.actions';
import { BenchmarksWallet } from '@shared/types/benchmarks/benchmarks-wallet.type';
import { BenchmarksTransaction } from '@shared/types/benchmarks/benchmarks-transaction.type';

const initialState: BenchmarksState = {
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
};

export function reducer(state: BenchmarksState = initialState, action: BenchmarksActions): BenchmarksState {
  switch (action.type) {

    case BENCHMARKS_GET_WALLETS_SUCCESS: {
      return {
        ...state,
        wallets: action.payload,
        blockSending: false,
        txSendingBatch: state.txSendingBatch === undefined ? action.payload.length : state.txSendingBatch,
      };
    }

    case BENCHMARKS_UPDATE_WALLETS_SUCCESS: {
      return {
        ...state,
        wallets: state.wallets.map((wallet: BenchmarksWallet, i: number) => ({
          ...wallet,
          ...action.payload[i],
        })),
      };
    }

    case BENCHMARKS_GET_MEMPOOL_TRANSACTIONS_SUCCESS: {
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

    case BENCHMARKS_CHANGE_TRANSACTION_BATCH: {
      return {
        ...state,
        txSendingBatch: action.payload,
      };
    }

    case BENCHMARKS_GET_WALLETS: {
      return {
        ...state,
        blockSending: true,
      };
    }

    case BENCHMARKS_SEND_TXS: {
      const txsToSend: BenchmarksTransaction[] = state.wallets
        .slice(0, state.txSendingBatch)
        .map((wallet: BenchmarksWallet, i: number) => {
          const txsInMempool = state.mempoolTxs.filter(tx => tx.from === wallet.publicKey).map(tx => tx.nonce);
          const nonce = Math.max(wallet.nonce, txsInMempool.length ? (Math.max(...txsInMempool) + 1) : 0).toString();
          const counter = state.sentTxCount + i;
          const memo = Date.now() + ',' + (counter + 1) + ',' + localStorage.getItem('browserId');
          const payment = {
            from: wallet.publicKey,
            nonce,
            to: getRandomReceiver(wallet, state.wallets),
            fee: '1000000000',
            amount: '2000000000',
            memo,
            validUntil: '4294967295',
          };

          return {
            ...payment,
            privateKey: wallet.privateKey,
          };
        });

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

    case BENCHMARKS_SEND_TX_SUCCESS: {
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

    case BENCHMARKS_CLOSE: {
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
};
