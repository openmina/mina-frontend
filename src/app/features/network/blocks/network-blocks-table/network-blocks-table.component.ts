import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { NetworkMessage } from '@shared/types/network/messages/network-message.type';
import { NetworkMessagesFilter } from '@shared/types/network/messages/network-messages-filter.type';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import {
  NETWORK_PAUSE,
  NETWORK_SET_ACTIVE_ROW,
  NETWORK_TOGGLE_FILTER,
  NetworkPause,
  NetworkSetActiveRow,
  NetworkToggleFilter,
} from '@network/messages/network-messages.actions';
import { networkAvailableFilters } from '@network/messages/network-messages-filters/network-messages-filters.component';
import { NetworkMessagesFilterCategory } from '@shared/types/network/messages/network-messages-filter-group.type';
import { NetworkMessagesFilterTypes } from '@shared/types/network/messages/network-messages-filter-types.enum';
import { selectNetworkActiveFilters, selectNetworkActiveRow, selectNetworkStream } from '@network/messages/network-messages.state';
import { filter, fromEvent, throttleTime } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { APP_UPDATE_DEBUGGER_STATUS, AppUpdateDebuggerStatus } from '@app/app.actions';
import { NetworkBlocksService } from '@network/blocks/network-blocks.service';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks-table',
  templateUrl: './network-blocks-table.component.html',
  styleUrls: ['./network-blocks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100 w-100' },
})
export class NetworkBlocksTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;

  blocks: any[] = [];
  activeRow: any;
  activeFilters: NetworkMessagesFilter[] = [];
  idFromRoute: number;

  @ViewChild(CdkVirtualScrollViewport)
  public scrollViewport: CdkVirtualScrollViewport;

  private stream: boolean;

  constructor(private store: Store<MinaState>,
              private router: Router,
              private networkBlocksService: NetworkBlocksService) { super(); }

  ngOnInit(): void {
    this.listenToNetworkBlocks();
    this.listenToActiveRowChange();
    this.listenToNetworkFilters();
    this.listenToNetworkStream();
    this.listenToVirtualScrolling();
  }

  private listenToNetworkBlocks(): void {
    this.networkBlocksService.getBlocks()
      .subscribe((blocks: any[]) => {
        this.blocks = blocks;
        this.detect();
        this.scrollToElement();
        this.sendTotalDecrypted();
      });
  }

  private scrollToElement(): void {
    let scrollTo = this.blocks.length;
    if (this.idFromRoute) {
      const topElements = Math.floor(this.scrollViewport.elementRef.nativeElement.offsetHeight / 2 / this.itemSize);
      scrollTo = this.blocks.findIndex(m => m.id === this.idFromRoute) - topElements;
      this.idFromRoute = undefined;
    }
    this.scrollViewport.scrollToIndex(scrollTo);
  }

  private listenToNetworkStream(): void {
    this.store.select(selectNetworkStream)
      .pipe(untilDestroyed(this))
      .subscribe((stream: boolean) => this.stream = stream);
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectNetworkActiveRow)
      .pipe(untilDestroyed(this))
      .subscribe((row: NetworkMessage) => {
        this.activeRow = row;
        this.detect();
      });
  }

  private listenToNetworkFilters(): void {
    this.store.select(selectNetworkActiveFilters)
      .pipe(untilDestroyed(this))
      .subscribe((activeFilters: NetworkMessagesFilter[]) => {
        this.activeFilters = activeFilters;
      });
  }

  private listenToVirtualScrolling(): void {
    fromEvent(this.scrollViewport.elementRef.nativeElement.firstChild, 'wheel', { passive: true })
      .pipe(
        untilDestroyed(this),
        throttleTime(600),
        filter((event: Event) => this.stream && (event as WheelEvent).deltaY < 0),
      )
      .subscribe(() => this.pause());
    fromEvent(this.scrollViewport.elementRef.nativeElement, 'touchmove', { passive: true })
      .pipe(
        untilDestroyed(this),
        throttleTime(600),
        filter(() => this.stream),
      )
      .subscribe(() => this.pause());
  }

  onRowClick(row: NetworkMessage): void {
    if (row.id !== this.activeRow?.id) {
      this.router.navigate([Routes.NETWORK, Routes.MESSAGES, row.id], { queryParamsHandling: 'merge' });
      this.store.dispatch<NetworkSetActiveRow>({ type: NETWORK_SET_ACTIVE_ROW, payload: row });
    }
  }

  filterByCategory(category: string): void {
    const filters = networkAvailableFilters
      .reduce((found: NetworkMessagesFilterCategory, curr: NetworkMessagesFilterCategory[]) => found ?? curr.find(c => c.name === category), null)
      .filters;
    const type = filters.every(f => this.activeFilters.includes(f)) ? 'remove' : 'add';
    this.store.dispatch<NetworkToggleFilter>({ type: NETWORK_TOGGLE_FILTER, payload: { filters, type } });
  }

  private static getFilter(message: NetworkMessage): NetworkMessagesFilter {
    return {
      type: NetworkMessagesFilterTypes.ADDRESS,
      display: message.address,
      value: message.address,
    };
  }

  private sendFilterAction(filters: NetworkMessagesFilter[], type: 'remove' | 'add'): void {
    this.store.dispatch<NetworkToggleFilter>({ type: NETWORK_TOGGLE_FILTER, payload: { filters, type } });
  }

  private pause(): void {
    this.store.dispatch<NetworkPause>({ type: NETWORK_PAUSE });
  }

  clearFilters(): void {
    this.sendFilterAction(this.activeFilters, 'remove');
  }

  private sendTotalDecrypted(): void {
    if (!this.blocks.length) {
      return;
    }

    const current: NetworkMessage = this.blocks.slice().reverse().find((m: NetworkMessage) => m.failedToDecryptPercentage !== undefined);
    if (current) {
      this.store.dispatch<AppUpdateDebuggerStatus>({
        type: APP_UPDATE_DEBUGGER_STATUS,
        payload: { failed: current.failedToDecryptPercentage },
      });
    }
  }
}
