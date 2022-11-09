import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectWebNodeWalletState } from '@web-node/web-node.state';
import { WebNodeWallet } from '@shared/types/web-node/wallet/web-node-wallet.type';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';

export interface WebNodeWalletState {
  wallets: WebNodeWallet[];
  activeWallet: WebNodeWallet;
  transactions: WebNodeTransaction[];
  activeTransaction: WebNodeTransaction;
}

const select = <T>(selector: (state: WebNodeWalletState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectWebNodeWalletState,
  selector,
);

export const selectWebNodeWallets = select((webNode: WebNodeWalletState): WebNodeWallet[] => webNode.wallets);
export const selectWebNodeActiveWallet = select((webNode: WebNodeWalletState): WebNodeWallet => webNode.activeWallet);
export const selectWebNodeTransactions = select((webNode: WebNodeWalletState): WebNodeTransaction[] => webNode.transactions);
export const selectWebNodeActiveTransaction = select((webNode: WebNodeWalletState): WebNodeTransaction => webNode.activeTransaction);
