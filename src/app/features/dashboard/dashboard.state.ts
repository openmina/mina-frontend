import { MinaState } from '@app/app.setup';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { AggregatorState } from '@dashboard/aggregator/aggregator.state';
import { AggregatorIpcState } from '@dashboard/aggregator-ipc/aggregator-ipc.state';
import { DashboardNodesState } from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardSplitsState } from '@dashboard/splits/dashboard-splits.state';

export interface DashboardState {
  aggregator: AggregatorState;
  aggregatorIpc: AggregatorIpcState;
  nodes: DashboardNodesState;
  splits: DashboardSplitsState;
}

const select = <T>(selector: (state: DashboardState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectDashboardState,
  selector,
);

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');
export const selectAggregatorState = select((state: DashboardState): AggregatorState => state.aggregator);
export const selectAggregatorIpcState = select((state: DashboardState): AggregatorIpcState => state.aggregatorIpc);
export const selectDashboardNodesState = select((state: DashboardState): DashboardNodesState => state.nodes);
export const selectDashboardSplitsState = select((state: DashboardState): DashboardSplitsState => state.splits);
