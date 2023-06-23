import { ActionReducer, combineReducers } from '@ngrx/store';

import * as fromNodes from '@dashboard/nodes/dashboard-nodes.reducer';
import * as fromSplits from '@dashboard/splits/dashboard-splits.reducer';
import { DashboardState } from '@dashboard/dashboard.state';
import { DashboardNodesAction, DashboardNodesActions } from '@dashboard/nodes/dashboard-nodes.actions';
import { DashboardSplitsAction, DashboardSplitsActions } from '@dashboard/splits/dashboard-splits.actions';

export type DashboardActions =
  & DashboardNodesActions
  & DashboardSplitsActions
  ;
export type DashboardAction =
  & DashboardNodesAction
  & DashboardSplitsAction
  ;

export const reducer: ActionReducer<DashboardState, DashboardActions> = combineReducers<DashboardState, DashboardActions>({
  nodes: fromNodes.reducer,
  splits: fromSplits.reducer,
});
