import { ActionReducer, combineReducers } from '@ngrx/store';

import * as fromAggregator from '@dashboard/aggregator/aggregator.reducer';
import * as fromAggregatorIpc from '@dashboard/aggregator-ipc/aggregator-ipc.reducer';
import * as fromNodes from '@dashboard/nodes/dashboard-nodes.reducer';
import { DashboardState } from '@dashboard/dashboard.state';
import { AggregatorAction, AggregatorActions } from '@dashboard/aggregator/aggregator.actions';
import { AggregatorIpcAction, AggregatorIpcActions } from '@dashboard/aggregator-ipc/aggregator-ipc.actions';
import { DashboardNodesAction, DashboardNodesActions } from '@dashboard/nodes/dashboard-nodes.actions';

export type DashboardActions = AggregatorActions & AggregatorIpcActions & DashboardNodesActions;
export type DashboardAction = AggregatorAction & AggregatorIpcAction & DashboardNodesAction;

export const reducer: ActionReducer<DashboardState, DashboardActions> = combineReducers<DashboardState, DashboardActions>({
  aggregator: fromAggregator.reducer,
  aggregatorIpc: fromAggregatorIpc.reducer,
  nodes: fromNodes.reducer,
});
