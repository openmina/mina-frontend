import { ActionReducer, combineReducers } from '@ngrx/store';
import { DswState } from '@dsw/dsw.state';

import * as fromDashboard from '@dsw/dashboard/dsw-dashboard.reducer';
import { DswDashboardAction, DswDashboardActions } from '@dsw/dashboard/dsw-dashboard.actions';

import * as fromActions from '@dsw/actions/dsw-actions.reducer';
import { DswActionsAction, DswActionsActions } from '@dsw/actions/dsw-actions.actions';

import * as fromBootstrap from '@dsw/bootstrap/dsw-bootstrap.reducer';
import { DswBootstrapAction, DswBootstrapActions } from '@dsw/bootstrap/dsw-bootstrap.actions';

import * as fromFrontier from '@dsw/frontier/dsw-frontier.reducer';
import { DswFrontierAction, DswFrontierActions } from '@dsw/frontier/dsw-frontier.actions';

export type DswActions =
  & DswDashboardActions
  & DswBootstrapActions
  & DswActionsActions
  & DswFrontierActions
  ;
export type DswAction =
  & DswDashboardAction
  & DswBootstrapAction
  & DswActionsAction
  & DswFrontierAction
  ;

export const reducer: ActionReducer<DswState, DswActions> = combineReducers<DswState, DswActions>({
  dashboard: fromDashboard.reducer,
  bootstrap: fromBootstrap.reducer,
  actions: fromActions.reducer,
  frontier: fromFrontier.reducer,
});
