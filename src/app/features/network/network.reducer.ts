import { ActionReducer, combineReducers } from '@ngrx/store';
import { NetworkState } from '@network/network.state';

import * as fromMessages from '@network/messages/network-messages.reducer';
import * as fromConnections from '@network/connections/network-connections.reducer';
import * as fromBlocks from '@network/blocks/network-blocks.reducer';
import * as fromBlocksIpc from '@network/blocks-ipc/network-blocks-ipc.reducer';

import { NetworkMessagesAction, NetworkMessagesActions } from '@network/messages/network-messages.actions';
import { NetworkConnectionsAction, NetworkConnectionsActions } from '@network/connections/network-connections.actions';
import { NetworkBlocksAction, NetworkBlocksActions } from '@network/blocks/network-blocks.actions';
import { NetworkBlocksIpcAction, NetworkBlocksIpcActions } from '@network/blocks-ipc/network-blocks-ipc.actions';

export type NetworkActions = NetworkMessagesActions & NetworkConnectionsActions & NetworkBlocksActions & NetworkBlocksIpcActions;
export type NetworkAction = NetworkMessagesAction & NetworkConnectionsAction & NetworkBlocksAction & NetworkBlocksIpcAction;

export const reducer: ActionReducer<NetworkState, NetworkActions> = combineReducers<NetworkState, NetworkActions>({
  messages: fromMessages.reducer,
  connections: fromConnections.reducer,
  blocks: fromBlocks.reducer,
  blocksIpc: fromBlocksIpc.reducer,
});
