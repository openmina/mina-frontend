import { ActionReducer, combineReducers } from '@ngrx/store';
import { DswState } from '@dsw/dsw.state';

import * as fromActions from '@dsw/actions/dsw-actions.reducer';
import { DswActionsAction, DswActionsActions } from '@dsw/actions/dsw-actions.actions';

import * as fromDashboard from '@dsw/dashboard/dsw-dashboard.reducer';
import { DswDashboardAction, DswDashboardActions } from '@dsw/dashboard/dsw-dashboard.actions';

import * as fromFrontier from '@dsw/frontier/dsw-frontier.reducer';
import { DswFrontierAction, DswFrontierActions } from '@dsw/frontier/dsw-frontier.actions';


export type DswActions =
  & DswActionsActions
  & DswDashboardActions
  & DswFrontierActions
  ;
export type DswAction =
  & DswActionsAction
  & DswDashboardAction
  & DswFrontierAction
  ;

export const reducer: ActionReducer<DswState, DswActions> = combineReducers<DswState, DswActions>({
  actions: fromActions.reducer,
  dashboard: fromDashboard.reducer,
  frontier: fromFrontier.reducer,
});
