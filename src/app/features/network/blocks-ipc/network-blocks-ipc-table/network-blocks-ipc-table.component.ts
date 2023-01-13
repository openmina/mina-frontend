import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { NetworkMessagesFilter } from '@shared/types/network/messages/network-messages-filter.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Router } from '@angular/router';
import { delay, mergeMap, of } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import {
  NETWORK_BLOCKS_IPC_SORT,
  NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL,
  NetworkBlocksIpcSort,
  NetworkBlocksIpcToggleSidePanel,
} from '@network/blocks-ipc/network-blocks-ipc.actions';
import { selectNetworkBlocksIpc, selectNetworkBlocksIpcSidePanelOpen, selectNetworkBlocksIpcSorting } from '@network/blocks-ipc/network-blocks-ipc.state';
import { NetworkBlockIpc } from '@shared/types/network/blocks-ipc/network-block-ipc.type';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks-ipc-table',
  templateUrl: './network-blocks-ipc-table.component.html',
  styleUrls: ['./network-blocks-ipc-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class NetworkBlocksIpcTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;
  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<NetworkBlockIpc>[] = [
    { name: 'datetime', sort: 'timestamp' },
    { name: 'real datetime', sort: 'realTimestamp' },
    { name: 'date diff', sort: 'dateDiff' },
    { name: 'message hash', sort: 'hash' },
    { name: 'height' },
    { name: 'node address', sort: 'nodeAddress' },
    { name: 'peer address', sort: 'peerAddress' },
    { name:  'type' },
    { name: 'message type', sort: 'msgType' },
    { name: 'block latency', sort: 'blockLatency' },
    { name: 'real block latency', sort: 'realBlockLatency' },
  ];

  blocks: NetworkBlockIpc[] = [];
  activeFilters: NetworkMessagesFilter[] = [];
  idFromRoute: string;
  currentSort: TableSort<NetworkBlockIpc>;
  isSidePanelOpen: boolean;

  @ViewChild(CdkVirtualScrollViewport)
  public scrollViewport: CdkVirtualScrollViewport;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToNetworkBlocks();
    this.listenToSortingChanges();
    this.listenToSidePanelOpeningChange();
  }

  private listenToSortingChanges(): void {
    this.store.select(selectNetworkBlocksIpcSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.detect();
      });
  }

  private listenToNetworkBlocks(): void {
    this.store.select(selectNetworkBlocksIpc)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: NetworkBlockIpc[]) => {
        this.blocks = blocks;
        this.detect();
      });
  }

  private listenToSidePanelOpeningChange(): void {
    this.store.select(selectNetworkBlocksIpcSidePanelOpen)
      .pipe(
        untilDestroyed(this),
        mergeMap((open: boolean) => {
          const ms = open ? 0 : 150;
          return of(open).pipe(delay(ms));
        }),
      )
      .subscribe((open: boolean) => {
        this.isSidePanelOpen = open;
        this.detect();
      });
  }

  sortTable(sortBy: string | keyof NetworkBlockIpc): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<NetworkBlocksIpcSort>({
      type: NETWORK_BLOCKS_IPC_SORT,
      payload: { sortBy: sortBy as keyof NetworkBlockIpc, sortDirection },
    });
  }

  seeMessageInMessages(messageId: number): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES, messageId]);
  }

  seeMessagesForAddress(addr: string): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES], {
      queryParams: { addr },
    });
  }

  toggleSidePanel(): void {
    this.store.dispatch<NetworkBlocksIpcToggleSidePanel>({ type: NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL });
  }
}
