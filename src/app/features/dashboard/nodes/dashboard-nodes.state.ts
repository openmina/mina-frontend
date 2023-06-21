import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { selectDashboardNodesState } from '@dashboard/dashboard.state';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { DashboardNodeCount } from '@shared/types/dashboard/node-list/dashboard-node-count.type';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { DashboardForkFilter } from '@shared/types/dashboard/node-list/dashboard-fork-filter.type';


export interface DashboardNodesState {
  nodes: DashboardNode[];
  filteredNodes: DashboardNode[];
  sort: TableSort<DashboardNode>;
  nodeCount: DashboardNodeCount;
  numOfNodes: number;
  activeNode: DashboardNode;
  blockTraces: TracingTraceGroup[];
  activeBlock: number;
  earliestBlock: number;
  allFilters: string[];
  activeFilters: string[];
  showOfflineNodes: boolean;
  latencyFromFastest: boolean;
  remainingOngoingRequests: number;
  forks: DashboardForkFilter[];
  activeForkFilter: { value: string, type: 'branch' | 'bestTip' };
}

const select = <T>(selector: (state: DashboardNodesState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectDashboardNodesState,
  selector,
);

export const selectDashboardNodes = select((state: DashboardNodesState): DashboardNode[] => state.filteredNodes);
export const selectDashboardNodesActiveNode = select((state: DashboardNodesState): DashboardNode => state.activeNode);
export const selectDashboardNodesSorting = select((state: DashboardNodesState): TableSort<DashboardNode> => state.sort);
export const selectDashboardNodesNodeCount = select((state: DashboardNodesState): DashboardNodeCount => state.nodeCount);
export const selectDashboardNodesNumOfNodes = select((state: DashboardNodesState): number => state.numOfNodes);
export const selectDashboardNodesBlockTraces = select((state: DashboardNodesState): TracingTraceGroup[] => state.blockTraces);
export const selectDashboardNodesActiveBlockLevel = select((state: DashboardNodesState): number => state.activeBlock);
export const selectDashboardNodesEarliestBlockLevel = select((state: DashboardNodesState): number => state.earliestBlock);
export const selectDashboardNodesAllFilters = select((state: DashboardNodesState): string[] => state.allFilters);
export const selectDashboardNodesActiveFilters = select((state: DashboardNodesState): string[] => state.activeFilters);
export const selectDashboardNodesShowOfflineNodes = select((state: DashboardNodesState): boolean => state.showOfflineNodes);
export const selectDashboardNodesLatencyFromFastest = select((state: DashboardNodesState): boolean => state.latencyFromFastest);
export const selectDashboardNodesRemainingRequests = select((state: DashboardNodesState): number => state.remainingOngoingRequests);
export const selectDashboardNodesForks = select((state: DashboardNodesState): DashboardForkFilter[] => state.forks);
export const selectDashboardNodesActiveForkFilter = select((state: DashboardNodesState): { value: string, type: 'branch' | 'bestTip' } => state.activeForkFilter);
