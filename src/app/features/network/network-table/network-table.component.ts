import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NetworkMessage } from '@shared/types/network/network-message.type';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import {
  NETWORK_GET_SPECIFIC_MESSAGE,
  NETWORK_PAUSE,
  NETWORK_SET_ACTIVE_ROW,
  NETWORK_TOGGLE_FILTER,
  NetworkGetSpecificMessage,
  NetworkPause,
  NetworkSetActiveRow,
  NetworkToggleFilter,
} from '@network/network.actions';
import { selectNetworkActiveFilters, selectNetworkActiveRow, selectNetworkMessages, selectNetworkStream } from '@network/network.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkFilter } from '@shared/types/network/network-filter.type';
import { NetworkFilterTypes } from '@shared/types/network/network-filter-types.enum';
import { filter, fromEvent, throttleTime } from 'rxjs';
import { NetworkFilterCategory } from '@shared/types/network/network-filter-group.type';
import { networkAvailableFilters } from '@network/network-filters/network-filters.component';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Routes } from '@shared/enums/routes.enum';

@UntilDestroy()
@Component({
  selector: 'mina-network-table',
  templateUrl: './network-table.component.html',
  styleUrls: ['./network-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class NetworkTableComponent extends ManualDetection implements OnInit {

  messages: NetworkMessage[] = [];
  activeRow: NetworkMessage;
  activeFilters: NetworkFilter[] = [];
  itemSize: number = 36;
  idFromRoute: number;
  attemptToGetMessagesFromRoute: boolean = true;

  @ViewChild(CdkVirtualScrollViewport)
  public scrollViewport: CdkVirtualScrollViewport;

  private stream: boolean;
  private queryParams: Params;

  constructor(private store: Store<MinaState>,
              private router: Router,
              private route: ActivatedRoute) { super(); }

  ngOnInit(): void {
    this.listenToNetworkMessages();
    this.listenToActiveRowChange();
    this.listenToNetworkFilters();
    this.listenToNetworkStream();
    this.listenToVirtualScrolling();
    this.listenToRouteChange();
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this))
      .subscribe((route: MergedRoute) => {
        this.queryParams = route.queryParams;
        const idFromRoute = Number(route.params['messageId']);
        const isValidIdInRoute = !isNaN(idFromRoute);
        if (this.attemptToGetMessagesFromRoute && (isValidIdInRoute || Object.keys(route.queryParams).length !== 0)) {
          this.attemptToGetMessagesFromRoute = false;

          const filters = this.getFiltersFromTheRoute(route);

          if (isValidIdInRoute) {
            this.idFromRoute = idFromRoute;
            this.store.dispatch<NetworkGetSpecificMessage>({ type: NETWORK_GET_SPECIFIC_MESSAGE, payload: { id: idFromRoute, filters, type: 'add' } });
          } else if (filters.length) {
            this.store.dispatch<NetworkToggleFilter>({ type: NETWORK_TOGGLE_FILTER, payload: { filters, type: 'add' } });
          }
        }
      });
  }

  private getFiltersFromTheRoute(route: MergedRoute): NetworkFilter[] {
    const filters: NetworkFilter[] = [];
    const availableFilters: NetworkFilter[] = networkAvailableFilters
      .reduce((acc: NetworkFilter[], current: NetworkFilterCategory[]) => [
        ...acc,
        ...current.reduce((acc2: NetworkFilter[], curr: NetworkFilterCategory) => [...acc2, ...curr.filters], []),
      ], []);
    const streamKindFilters = route.queryParams['stream_kind']?.split(',').map((value: string) => availableFilters.find(f => f.value === value)) ?? [];

    const messageKindFilters = route.queryParams['message_kind']?.split(',').map((value: string) => availableFilters.find(f => f.value === value)) ?? [];

    const connectionId = route.queryParams['connection_id'];
    if (connectionId) {
      filters.push({ type: NetworkFilterTypes.CONNECTION_ID, value: Number(connectionId), display: connectionId } as NetworkFilter);
    }
    filters.push(...streamKindFilters);
    filters.push(...messageKindFilters);
    return filters;
  }

  private listenToNetworkMessages(): void {
    this.store.select(selectNetworkMessages)
      .pipe(untilDestroyed(this))
      .subscribe((messages: NetworkMessage[]) => {
        this.messages = messages;
        this.detect();
        this.scrollToElement();
      });
  }

  private scrollToElement(): void {
    let scrollTo = this.messages.length;
    if (this.idFromRoute) {
      const topElements = Math.floor(this.scrollViewport.elementRef.nativeElement.offsetHeight / 2 / this.itemSize);
      scrollTo = this.messages.findIndex(m => m.id === this.idFromRoute) - topElements;
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
      .subscribe((activeFilters: NetworkFilter[]) => {
        this.activeFilters = activeFilters;
      });
  }

  private listenToVirtualScrolling(): void {
    fromEvent(this.scrollViewport.elementRef.nativeElement.firstChild, 'wheel')
      .pipe(
        untilDestroyed(this),
        throttleTime(600),
        filter((event: Event) => this.stream && (event as WheelEvent).deltaY < 0),
      )
      .subscribe(() => this.pause());
    fromEvent(this.scrollViewport.elementRef.nativeElement, 'touchmove')
      .pipe(
        untilDestroyed(this),
        throttleTime(600),
        filter(() => this.stream),
      )
      .subscribe(() => this.pause());
  }

  onRowClick(row: NetworkMessage): void {
    if (row.id !== this.activeRow?.id) {
      this.router.navigate([Routes.NETWORK, row.id], { queryParamsHandling: 'merge' });
      this.store.dispatch<NetworkSetActiveRow>({ type: NETWORK_SET_ACTIVE_ROW, payload: row });
    }
  }

  filterByConnectionID(message: NetworkMessage): void {
    const type = this.activeFilters.some(f => f.value === message.connectionId) ? 'remove' : 'add';
    const filter = NetworkTableComponent.getFilter(message);
    if (type === 'add') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          ...this.queryParams,
          connection_id: message.connectionId,
        },
      });
    }
    this.sendFilterAction([filter], type);
  }

  filterByCategory(category: string): void {
    const filters = networkAvailableFilters
      .reduce((found: NetworkFilterCategory, curr: NetworkFilterCategory[]) => found ?? curr.find(c => c.name === category), null)
      .filters;
    const type = filters.every(f => this.activeFilters.includes(f)) ? 'remove' : 'add';
    this.store.dispatch<NetworkToggleFilter>({ type: NETWORK_TOGGLE_FILTER, payload: { filters, type } });
  }

  // filterByStreamId(message: NetworkMessage): void {
  //   const getStreamIdValue = (streamId: NetworkMessageStreamId): string => {
  //     return streamId.type === NetworkMessageStreamIdTypes.STRING
  //       ? streamId.value
  //       : streamId.type === NetworkMessageStreamIdTypes.FORWARD ? `forward_${streamId.value}` : `backward_${streamId.value}`;
  //   };
  //
  //   const filters = [];
  //   if (!this.activeFilters.some(f => f.value === message.connectionId.toString())) {
  //     filters.push(NetworkTableComponent.getFilter(message.connectionId.toString()));
  //   }
  //
  //   const type = this.activeFilters.some(f => f.value === getStreamIdValue(message.streamId)) ? 'remove' : 'add';
  //   const streamIdFilter: NetworkFilter = {
  //     type: NetworkFilterTypes.STREAM_ID,
  //     display: 'Stream ID: ' + message.streamId.value +
  //       (message.streamId.type === NetworkMessageStreamIdTypes.STRING
  //         ? '' : message.streamId.type === NetworkMessageStreamIdTypes.FORWARD ? 'a' : 'b'),
  //     value: getStreamIdValue(message.streamId),
  //   };
  //   filters.push(streamIdFilter);
  //   this.sendFilterAction(filters, type);
  // }

  private static getFilter(message: NetworkMessage): NetworkFilter {
    return {
      type: NetworkFilterTypes.CONNECTION_ID,
      display: message.address,
      value: message.connectionId,
    };
  }

  private sendFilterAction(filters: NetworkFilter[], type: 'remove' | 'add'): void {
    this.store.dispatch<NetworkToggleFilter>({ type: NETWORK_TOGGLE_FILTER, payload: { filters, type } });
  }

  private pause(): void {
    this.store.dispatch<NetworkPause>({ type: NETWORK_PAUSE });
  }

  clearFilters(): void {
    this.sendFilterAction(this.activeFilters, 'remove');
  }
}
