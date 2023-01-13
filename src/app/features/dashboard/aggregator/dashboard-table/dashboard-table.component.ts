import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectAggregatorMessages, selectAggregatorSidePanelOpen, selectAggregatorSorting } from '@dashboard/aggregator/aggregator.state';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { NetworkMessagesFilter } from '@shared/types/network/messages/network-messages-filter.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { Router } from '@angular/router';
import { delay, mergeMap, of } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { DashboardMessage } from '@shared/types/dashboard/dashboard-message';
import { AGGREGATOR_SORT, AGGREGATOR_TOGGLE_SIDE_PANEL, AggregatorSort, AggregatorToggleSidePanel } from '@dashboard/aggregator/aggregator.actions';

@UntilDestroy()
@Component({
  selector: 'mina-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class DashboardTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;
  // readonly secConfigForRebLatency: SecDurationConfig = { onlySeconds: true, undefinedAlternative: '-', color: true, red: 30, orange: 5 };
  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<DashboardMessage>[] = [
    { name: 'datetime', sort: 'timestamp' },
    { name: 'Received ID', sort: 'receivedMessageId' },
    { name: 'Sent ID', sort: 'sentMessageId' },
    { name: 'hash' },
    { name: 'height' },
    { name: 'source', sort: 'sourceAddr' },
    { name: 'node', sort: 'nodeAddr' },
    { name: 'destination', sort: 'destAddr' },
    // { name: 'Rebroadcast Latency', sort: 'rebroadcastLatency' },
    { name: 'Block latency', sort: 'blockLatency' },
  ];

  blocks: DashboardMessage[] = [];
  activeFilters: NetworkMessagesFilter[] = [];
  currentSort: TableSort<DashboardMessage>;
  isSidePanelOpen: boolean;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToNetworkBlocks();
    this.listenToSortingChanges();
    this.listenToSidePanelOpeningChange();
  }

  private listenToSortingChanges(): void {
    this.store.select(selectAggregatorSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.detect();
      });
  }

  private listenToNetworkBlocks(): void {
    this.store.select(selectAggregatorMessages)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: DashboardMessage[]) => {
        this.blocks = blocks;
        this.detect();
      });
  }

  private listenToSidePanelOpeningChange(): void {
    this.store.select(selectAggregatorSidePanelOpen)
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
    this.store.dispatch<AggregatorSort>({
      type: AGGREGATOR_SORT,
      payload: { sortBy: sortBy as keyof DashboardMessage, sortDirection },
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
    this.store.dispatch<AggregatorToggleSidePanel>({ type: AGGREGATOR_TOGGLE_SIDE_PANEL });
  }
}
