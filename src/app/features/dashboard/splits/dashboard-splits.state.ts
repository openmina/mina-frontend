import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectDashboardSplitsState } from '@dashboard/dashboard.state';
import { DashboardSplitsPeer } from '@shared/types/dashboard/splits/dashboard-splits-peer.type';
import { DashboardSplitsLink } from '@shared/types/dashboard/splits/dashboard-splits-link.type';
import { DashboardSplitsSet } from '@shared/types/dashboard/splits/dashboard-splits-set.type';
import { DashboardNodeCount } from '@shared/types/dashboard/node-list/dashboard-node-count.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

export interface DashboardSplitsState {
  peers: DashboardSplitsPeer[];
  links: DashboardSplitsLink[];
  sets: DashboardSplitsSet[];
  activePeer: DashboardSplitsPeer;
  networkSplitsDetails: string;
  networkMergeDetails: string;
  nodeStats: DashboardNodeCount;
  fetching: boolean;
  sort: TableSort<DashboardSplitsPeer>;
  openSidePanel: boolean;
}

const select = <T>(selector: (state: DashboardSplitsState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectDashboardSplitsState,
  selector,
);

export const selectDashboardSplitsPeers = select((state: DashboardSplitsState): DashboardSplitsPeer[] => state.peers);
export const selectDashboardSplitsLinks = select((state: DashboardSplitsState): DashboardSplitsLink [] => state.links);
export const selectDashboardSplitsSets = select((state: DashboardSplitsState): DashboardSplitsSet[] => state.sets);
export const selectDashboardSplitsFetching = select((state: DashboardSplitsState): boolean => state.fetching);
export const selectDashboardSplitsPeersAndLinksAndSetsAndFetching = createSelector(
  selectDashboardSplitsPeers,
  selectDashboardSplitsLinks,
  selectDashboardSplitsSets,
  selectDashboardSplitsFetching,
  (peers: DashboardSplitsPeer[], links: DashboardSplitsLink[], sets: DashboardSplitsSet[], fetching: boolean) => ({ peers, links, sets, fetching }),
);
export const selectDashboardSplitsPeersAndSets = createSelector(
  selectDashboardSplitsPeers,
  selectDashboardSplitsSets,
  (peers: DashboardSplitsPeer[], sets: DashboardSplitsSet[]) => ({ peers, sets }),
);
export const selectDashboardSplitsActivePeer = select((state: DashboardSplitsState): DashboardSplitsPeer => state.activePeer);
export const selectDashboardSplitsNetworkSplitsDetails = select((state: DashboardSplitsState): string => state.networkSplitsDetails);
export const selectDashboardSplitsNetworkMergeDetails = select((state: DashboardSplitsState): string => state.networkMergeDetails);
export const selectDashboardSplitsNodeStats = select((state: DashboardSplitsState): DashboardNodeCount => state.nodeStats);
export const selectDashboardSplitsSort = select((state: DashboardSplitsState): TableSort<DashboardSplitsPeer> => state.sort);
export const selectDashboardSplitsOpenSidePanel = select((state: DashboardSplitsState): boolean => state.openSidePanel);

