import { ActionReducer, combineReducers } from '@ngrx/store';
import { NetworkState } from '@network/network.state';

import * as fromMessages from '@network/messages/network-messages.reducer';
import * as fromConnections from '@network/connections/network-connections.reducer';

import { TracingBlocksAction, TracingBlocksActions } from '@tracing/tracing-blocks/tracing-blocks.actions';
import { TracingOverviewAction, TracingOverviewActions } from '@tracing/tracing-overview/tracing-overview.actions';

export type NetworkActions = TracingBlocksActions & TracingOverviewActions;
export type NetworkAction = TracingBlocksAction & TracingOverviewAction;

export const reducer: ActionReducer<NetworkState, NetworkActions> = combineReducers<NetworkState, NetworkActions>({
  messages: fromMessages.reducer,
  connections: fromConnections.reducer,
});
