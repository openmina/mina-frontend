import { ActionReducer, combineReducers } from '@ngrx/store';
import { NetworkState } from '@network/network.state';

import * as fromMessages from '@network/messages/network-messages.reducer';
import * as fromConnections from '@network/connections/network-connections.reducer';
import * as fromBlocks from '@network/blocks/network-blocks.reducer';
import * as fromSnarks from '@network/snarks/network-snarks.reducer';
import * as fromTransactions from '@network/transactions/network-transactions.reducer';
import * as fromGlobal from '@network/global/network-global.reducer';

import { NetworkMessagesAction, NetworkMessagesActions } from '@network/messages/network-messages.actions';
import { NetworkConnectionsAction, NetworkConnectionsActions } from '@network/connections/network-connections.actions';
import { NetworkBlocksAction, NetworkBlocksActions } from '@network/blocks/network-blocks.actions';
import { NetworkSnarksAction, NetworkSnarksActions } from '@network/snarks/network-snarks.actions';
import { NetworkGlobalAction, NetworkGlobalActions } from '@network/global/network-global.actions';

export type NetworkActions = NetworkMessagesActions & NetworkConnectionsActions & NetworkBlocksActions & NetworkSnarksActions & NetworkGlobalActions;
export type NetworkAction = NetworkMessagesAction & NetworkConnectionsAction & NetworkBlocksAction & NetworkSnarksAction & NetworkGlobalAction;

export const reducer: ActionReducer<NetworkState, NetworkActions> = combineReducers<NetworkState, NetworkActions>({
  messages: fromMessages.reducer,
  connections: fromConnections.reducer,
  blocks: fromBlocks.reducer,
  snarks: fromSnarks.reducer,
  transactions: fromTransactions.reducer,
  global: fromGlobal.reducer,
});
