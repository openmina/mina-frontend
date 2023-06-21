import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectDswDashboardState } from '@dsw/dsw.state';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

export interface DswDashboardState {
  nodes: DswDashboardNode[];
  activeNode: DswDashboardNode;
  openSidePanel: boolean;
  sort: TableSort<DswDashboardNode>;
}

const select = <T>(selector: (state: DswDashboardState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectDswDashboardState,
  selector,
);

export const selectDswDashboardNodes = select((state: DswDashboardState): DswDashboardNode[] => state.nodes);
export const selectDswDashboardOpenSidePanel = select((state: DswDashboardState): boolean => state.openSidePanel);
export const selectDswDashboardSort = select((state: DswDashboardState): TableSort<DswDashboardNode> => state.sort);
export const selectDswDashboardActiveNode = select((state: DswDashboardState): DswDashboardNode => state.activeNode);
