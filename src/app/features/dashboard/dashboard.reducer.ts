import { ActionReducer, combineReducers } from '@ngrx/store';

import * as fromAggregatorIpc from '@dashboard/aggregator-ipc/aggregator-ipc.reducer';
import * as fromNodes from '@dashboard/nodes/dashboard-nodes.reducer';
import * as fromSplits from '@dashboard/splits/dashboard-splits.reducer';
import { DashboardState } from '@dashboard/dashboard.state';
import { AggregatorIpcAction, AggregatorIpcActions } from '@dashboard/aggregator-ipc/aggregator-ipc.actions';
import { DashboardNodesAction, DashboardNodesActions } from '@dashboard/nodes/dashboard-nodes.actions';
import { DashboardSplitsAction, DashboardSplitsActions } from '@dashboard/splits/dashboard-splits.actions';

export type DashboardActions = AggregatorIpcActions & DashboardNodesActions & DashboardSplitsActions;
export type DashboardAction = AggregatorIpcAction & DashboardNodesAction & DashboardSplitsAction;

export const reducer: ActionReducer<DashboardState, DashboardActions> = combineReducers<DashboardState, DashboardActions>({
  aggregatorIpc: fromAggregatorIpc.reducer,
  nodes: fromNodes.reducer,
  splits: fromSplits.reducer,
});
