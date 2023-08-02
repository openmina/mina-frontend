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

import * as fromLive from '@dsw/live/dsw-live.reducer';
import { DswLiveAction, DswLiveActions } from '@dsw/live/dsw-live.actions';

import * as fromWorkPool from '@dsw/work-pool/dsw-work-pool.reducer';
import { DswWorkPoolAction, DswWorkPoolActions } from '@dsw/work-pool/dsw-work-pool.actions';

export type DswActions =
  & DswDashboardActions
  & DswBootstrapActions
  & DswActionsActions
  & DswFrontierActions
  & DswLiveActions
  & DswWorkPoolActions
  & any
  ;
export type DswAction =
  & DswDashboardAction
  & DswBootstrapAction
  & DswActionsAction
  & DswFrontierAction
  & DswLiveAction
  & DswWorkPoolAction
  ;

export const reducer: ActionReducer<DswState, DswActions> = combineReducers<DswState, DswActions>({
  dashboard: fromDashboard.reducer,
  bootstrap: fromBootstrap.reducer,
  actions: fromActions.reducer,
  frontier: fromFrontier.reducer,
  live: fromLive.reducer,
  workPool: fromWorkPool.reducer,
});
