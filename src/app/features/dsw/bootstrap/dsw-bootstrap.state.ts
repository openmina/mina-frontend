import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectDswBootstrapState, selectDswDashboardState } from '@dsw/dsw.state';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { DswDashboardBlock } from '@shared/types/dsw/dashboard/dsw-dashboard-block.type';

export interface DswBootstrapState {
  node: DswDashboardNode;
  activeBlock: DswDashboardBlock;
  sort: TableSort<DswDashboardBlock>;
}

const select = <T>(selector: (state: DswBootstrapState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectDswBootstrapState,
  selector,
);

export const selectDswBootstrapNode = select((state: DswBootstrapState): DswDashboardNode => state.node);
export const selectDswBootstrapBlocks = select((state: DswBootstrapState): DswDashboardBlock[] => state.node?.blocks || []);
export const selectDswBootstrapSort = select((state: DswBootstrapState): TableSort<DswDashboardBlock> => state.sort);
export const selectDswBootstrapActiveBlock = select((state: DswBootstrapState): DswDashboardBlock => state.activeBlock);
