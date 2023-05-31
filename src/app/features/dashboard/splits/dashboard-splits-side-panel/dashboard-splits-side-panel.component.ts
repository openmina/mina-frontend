import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { selectDashboardSplitsActivePeer, selectDashboardSplitsPeersAndSets, selectDashboardSplitsSort } from '@dashboard/splits/dashboard-splits.state';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { toggleItem } from '@shared/helpers/array.helper';
import { DashboardSplitsSetActivePeer, DashboardSplitsSortPeers } from '@dashboard/splits/dashboard-splits.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';
import { MergedRoute } from '@shared/router/merged-route';
import { DashboardSplitsPeer } from '@shared/types/dashboard/splits/dashboard-splits-peer.type';
import { DashboardSplitsSet } from '@shared/types/dashboard/splits/dashboard-splits-set.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';

@Component({
  selector: 'mina-dashboard-splits-side-panel',
  templateUrl: './dashboard-splits-side-panel.component.html',
  styleUrls: ['./dashboard-splits-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column border-left h-100 w-100' },
})
export class DashboardSplitsSidePanelComponent extends StoreDispatcher implements OnInit {

  readonly tableHeads: TableHeadSorting<DashboardSplitsPeer>[] = [
    { name: 'address' },
    { name: 'node' },
    { name: 'peer ID', sort: 'peerId' },
    { name: 'Conn. \nIn / Out', sort: 'outgoingConnections' },
  ];

  peers: DashboardSplitsPeer[];
  sets: DashboardSplitsSet[];
  expandedItems: number[] = [];
  activePeer: DashboardSplitsPeer;
  currentSort: TableSort<DashboardSplitsPeer>;

  private idFromRoute: string;

  constructor(private router: Router) {super();}

  ngOnInit(): void {
    this.listenToSortingChanges();
    this.listenToRouteChange();
    this.selectSplitsPeersAndLinks();
    this.listenToActivePeerChanges();
  }

  private listenToSortingChanges(): void {
    this.store.select(selectDashboardSplitsSort)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.detect();
      });
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this), take(1))
      .subscribe((route: MergedRoute) => {
        if (route.params['addr']) {
          this.idFromRoute = route.params['addr'];
        }
      });
  }

  private selectSplitsPeersAndLinks(): void {
    this.select(selectDashboardSplitsPeersAndSets, ({ peers, sets }: { peers: DashboardSplitsPeer[], sets: DashboardSplitsSet[] }) => {
      this.peers = peers;
      this.sets = sets;
      if (this.idFromRoute) {
        const peer = peers.find((peer: DashboardSplitsPeer) => peer.address === this.idFromRoute);
        if (peer) {
          const setIndex = sets.findIndex((set: DashboardSplitsSet) => set.peers.includes(peer));
          this.toggleExpandedItems(setIndex);
          this.selectPeer(peer);
          delete this.idFromRoute;
        }
      }
      if (sets.length === 1) {
        this.expandedItems = [0];
      }
      this.detect();
    });
  }

  private listenToActivePeerChanges(): void {
    this.select(selectDashboardSplitsActivePeer, (activePeer: DashboardSplitsPeer) => {
      this.activePeer = activePeer;
      const activeSetIndex = this.sets.findIndex((set: DashboardSplitsSet) => set.peers.includes(activePeer));
      if (!this.expandedItems.includes(activeSetIndex)) {
        this.expandedItems = toggleItem(this.expandedItems, activeSetIndex);
      }
      this.detect();
    });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(DashboardSplitsSortPeers, { sortBy: sortBy as keyof DashboardSplitsPeer, sortDirection });
  }

  toggleExpandedItems(i: number): void {
    this.expandedItems = toggleItem(this.expandedItems, i);
    if (this.activePeer) {
      const index = this.expandedItems.indexOf(this.sets.findIndex((set: DashboardSplitsSet) => set.peers.includes(this.activePeer)));
      if (index === -1) {
        this.activePeer = undefined;
        this.selectPeer(undefined);
      }
    }
    this.detect();
  }

  selectPeer(peer: DashboardSplitsPeer): void {
    if (peer) {
      this.router.navigate([Routes.DASHBOARD, Routes.TOPOLOGY, peer.address]);
    }
    if (this.activePeer === peer) {
      this.router.navigate([Routes.DASHBOARD, Routes.TOPOLOGY]);
      this.dispatch(DashboardSplitsSetActivePeer, undefined);
      return;
    }
    this.dispatch(DashboardSplitsSetActivePeer, peer);
  }
}
