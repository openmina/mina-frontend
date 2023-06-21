import { ActionReducer, combineReducers } from '@ngrx/store';
import { DswState } from '@dsw/dsw.state';

import * as fromActions from '@dsw/actions/dsw-actions.reducer';
import { DswActionsAction, DswActionsActions } from '@dsw/actions/dsw-actions.actions';

import * as fromDashboard from '@dsw/dashboard/dsw-dashboard.reducer';
import { DswDashboardAction, DswDashboardActions } from '@dsw/dashboard/dsw-dashboard.actions';


export type DswActions =
  & DswActionsActions
  & DswDashboardActions
  ;
export type DswAction =
  & DswActionsAction
  & DswDashboardAction
  ;

export const reducer: ActionReducer<DswState, DswActions> = combineReducers<DswState, DswActions>({
  actions: fromActions.reducer,
  dashboard: fromDashboard.reducer,
});
