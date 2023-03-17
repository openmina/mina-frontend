import { MinaState } from '@app/app.setup';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { NetworkMessagesState } from '@network/messages/network-messages.state';
import { NetworkConnectionsState } from '@network/connections/network-connections.state';
import { NetworkBlocksState } from '@network/blocks/network-blocks.state';
import { NetworkBlocksIpcState } from '@network/blocks-ipc/network-blocks-ipc.state';

export interface NetworkState {
  messages: NetworkMessagesState;
  connections: NetworkConnectionsState;
  blocks: NetworkBlocksState;
  blocksIpc: NetworkBlocksIpcState;
}

const select = <T>(selector: (state: NetworkState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectNetworkState,
  selector,
);

export const selectNetworkState = createFeatureSelector<NetworkState>('network');
export const selectNetworkMessagesState = select((state: NetworkState): NetworkMessagesState => state.messages);
export const selectNetworkConnectionsState = select((state: NetworkState): NetworkConnectionsState => state.connections);
export const selectNetworkBlocksState = select((state: NetworkState): NetworkBlocksState => state.blocks);
export const selectNetworkBlocksIpcState = select((state: NetworkState): NetworkBlocksIpcState => state.blocksIpc);
