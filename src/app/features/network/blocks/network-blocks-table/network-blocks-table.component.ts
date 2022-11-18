import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { NetworkMessagesFilter } from '@shared/types/network/messages/network-messages-filter.type';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { selectNetworkBlocks, selectNetworkBlocksSidePanelOpen, selectNetworkBlocksSorting } from '@network/blocks/network-blocks.state';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { NETWORK_BLOCKS_SORT, NETWORK_BLOCKS_TOGGLE_SIDE_PANEL, NetworkBlocksSort, NetworkBlocksToggleSidePanel } from '@network/blocks/network-blocks.actions';
import { delay, mergeMap, of } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks-table',
  templateUrl: './network-blocks-table.component.html',
  styleUrls: ['./network-blocks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class NetworkBlocksTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;
  readonly LOCAL_NODE: string = 'local node';
  readonly secConfig: SecDurationConfig = { onlySeconds: true, undefinedAlternative: '-', color: true, red: 30, orange: 5 };
  readonly tableHeads: TableHeadSorting[] = [
    { name: 'ID', sort: 'messageId' },
    { name: 'datetime', sort: 'date' },
    { name: 'block', sort: 'hash' },
    { name: 'height' },
    { name: 'from', sort: 'sender' },
    { name: 'to', sort: 'receiver' },
    { name: 'recv. time', sort: 'receivedLatency' },
    { name: 'sent time', sort: 'sentLatency' },
    { name: 'message kind', sort: 'messageKind' },
  ];

  blocks: NetworkBlock[] = [];
  activeFilters: NetworkMessagesFilter[] = [];
  idFromRoute: string;
  currentSort: TableSort;
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
    this.store.select(selectNetworkBlocksSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.detect();
      });
  }

  private listenToNetworkBlocks(): void {
    this.store.select(selectNetworkBlocks)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: NetworkBlock[]) => {
        this.blocks = blocks;
        this.detect();
      });
  }

  private listenToSidePanelOpeningChange(): void {
    this.store.select(selectNetworkBlocksSidePanelOpen)
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

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<NetworkBlocksSort>({
      type: NETWORK_BLOCKS_SORT,
      payload: { sortBy, sortDirection },
    });
  }

  seeMessageInMessages(messageId: number): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES, messageId]);
  }

  seeMessagesForAddress(addr: string): void {
    if (addr === this.LOCAL_NODE) {
      return;
    }
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES], {
      queryParams: { addr },
    });
  }

  toggleSidePanel(): void {
    this.store.dispatch<NetworkBlocksToggleSidePanel>({ type: NETWORK_BLOCKS_TOGGLE_SIDE_PANEL });
  }
}
