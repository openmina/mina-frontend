import { MinaState } from '@app/app.setup';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { WebNodeLogsState } from '@web-node/web-node-logs/web-node-logs.state';
import { WebNodeWalletState } from '@web-node/web-node-wallet/web-node-wallet.state';
import { WebNodePeersState } from '@web-node/web-node-peers/web-node-peers.state';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { WebNodeStatus } from '@shared/types/app/web-node-status.type';

export interface WebNodeSharedState {
  peers: WebNodeLog[];
  logs: WebNodeLog[];
  summary: WebNodeStatus;
  isOpen: boolean;
}

export interface WebNodeState {
  log: WebNodeLogsState;
  peers: WebNodePeersState;
  wallet: WebNodeWalletState;
  shared: WebNodeSharedState;
}

const select = <T>(selector: (state: WebNodeState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectWebNodeState,
  selector,
);

export const selectWebNodeState = createFeatureSelector<WebNodeState>('webNode');
export const selectWebNodeLogsState = select((state: WebNodeState): WebNodeLogsState => state.log);
export const selectWebNodePeersState = select((state: WebNodeState): WebNodePeersState => state.peers);
export const selectWebNodeWalletState = select((state: WebNodeState): WebNodeWalletState => state.wallet);
export const selectWebNodeSharedState = select((state: WebNodeState): WebNodeSharedState => state.shared);

export const selectWebNodePeers = (state: MinaState): WebNodeLog[] => state.webNode.shared.peers;
export const selectWebNodeLogs = (state: MinaState): WebNodeLog[] => state.webNode.shared.logs;
export const selectWebNodeSummary = (state: MinaState): WebNodeStatus => state.webNode.shared.summary;
