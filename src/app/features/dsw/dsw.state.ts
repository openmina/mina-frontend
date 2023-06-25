import { MinaState } from '@app/app.setup';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { DswActionsState } from '@dsw/actions/dsw-actions.state';
import { DswDashboardState } from '@dsw/dashboard/dsw-dashboard.state';
import { DswFrontierState } from '@dsw/frontier/dsw-frontier.state';

export interface DswState {
  dashboard: DswDashboardState;
  actions: DswActionsState;
  frontier: DswFrontierState;
}

const select = <T>(selector: (state: DswState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectDswState,
  selector,
);

export const selectDswState = createFeatureSelector<DswState>('dsw');
export const selectDswDashboardState = select((state: DswState): DswDashboardState => state.dashboard);
export const selectDswActionsState = select((state: DswState): DswActionsState => state.actions);
export const selectDswFrontierState = select((state: DswState): DswFrontierState => state.frontier);
