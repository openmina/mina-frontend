import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { NetworkMessagesFilter } from '@shared/types/network/messages/network-messages-filter.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Routes } from '@shared/enums/routes.enum';
import { AGGREGATOR_IPC_SORT, AggregatorIpcSort } from '@dashboard/aggregator-ipc/aggregator-ipc.actions';
import { AggregatorIpc } from '@shared/types/dashboard/aggregator-ipc/aggregator-ipc.type';
import { selectAggregatorIpcMessages, selectAggregatorIpcSorting } from '@dashboard/aggregator-ipc/aggregator-ipc.state';

@UntilDestroy()
@Component({
  selector: 'mina-aggregator-ipc-table',
  templateUrl: './aggregator-ipc-table.component.html',
  styleUrls: ['./aggregator-ipc-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class AggregatorIpcTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;
  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<AggregatorIpc>[] = [
    { name: 'date', sort: 'receiveTime' },
    { name: 'hash' },
    { name: 'height' },
    { name: 'source', sort: 'messageSource' },
    { name: 'node', sort: 'nodeAddress' },
    { name: 'Latency since sent', sort: 'latencySinceSent' },
  ];

  blocks: AggregatorIpc[] = [];
  activeFilters: NetworkMessagesFilter[] = [];
  currentSort: TableSort<AggregatorIpc>;
  isSidePanelOpen: boolean;

  @ViewChild(CdkVirtualScrollViewport)
  public scrollViewport: CdkVirtualScrollViewport;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToNetworkBlocks();
    this.listenToSortingChanges();
  }

  private listenToSortingChanges(): void {
    this.store.select(selectAggregatorIpcSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.detect();
      });
  }

  private listenToNetworkBlocks(): void {
    this.store.select(selectAggregatorIpcMessages)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: AggregatorIpc[]) => {
        this.blocks = blocks;
        this.detect();
      });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<AggregatorIpcSort>({
      type: AGGREGATOR_IPC_SORT,
      payload: { sortBy: sortBy as keyof AggregatorIpc, sortDirection },
    });
  }

  seeMessagesForAddress(addr: string): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES], {
      queryParams: { addr },
    });
  }
}
