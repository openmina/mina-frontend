import { ChangeDetectionStrategy, Component, ComponentRef, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { NetworkState, selectNetworkState, selectNetworkTimestampInterval } from '@network/network.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  NETWORK_GET_PAGINATED_MESSAGES,
  NETWORK_GO_LIVE,
  NETWORK_PAUSE,
  NETWORK_SET_TIMESTAMP_INTERVAL,
  NetworkGetPaginatedMessages,
  NetworkGoLive,
  NetworkPause,
  NetworkSetTimestampInterval,
} from '@network/network.actions';
import { NetworkMessagesDirection } from '@shared/types/network/network-messages-direction.enum';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { NetworkIntervalSelectComponent } from '@network/network-interval-select/network-interval-select.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { filter, take } from 'rxjs';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { NetworkTimestampInterval } from '@shared/types/network/network-timestamp-interval.type';
import { DatePipe } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'mina-network-table-footer',
  templateUrl: './network-table-footer.component.html',
  styleUrls: ['./network-table-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row align-center border-top' },
})
export class NetworkTableFooterComponent extends ManualDetection implements OnInit {

  @Output() onScrollTopClick: EventEmitter<void> = new EventEmitter<void>();

  state: NetworkState;
  isFirstPage: boolean;
  isLastPage: boolean;
  activeInterval: string;

  private overlayRef: OverlayRef;
  private intervalSelectComponent: ComponentRef<NetworkIntervalSelectComponent>;
  private currentTimestamp: NetworkTimestampInterval;

  @ViewChild('test') test: ElementRef<HTMLButtonElement>;

  constructor(private store: Store<MinaState>,
              private datePipe: DatePipe,
              private overlay: Overlay) { super(); }

  ngOnInit(): void {
    this.listenToNetworkMessages();
    this.listenToTimestampIntervalChange();
    //TODO: remove
    setTimeout(() => this.test.nativeElement.click(), 500);
  }

  private listenToNetworkMessages(): void {
    this.store.select(selectNetworkState)
      .pipe(untilDestroyed(this))
      .subscribe((state: NetworkState) => {
        this.state = state;
        this.isFirstPage = state.activePage.start?.id === 0 || state.messages.length < state.limit || state.activePage.firstPageIdWithFilters === state.activePage.start?.id;
        this.isLastPage = state.stream || (state.pages.length === 0 || state.activePage.end?.id === state.pages[state.pages.length - 1]);
        this.detect();
      });
  }

  private listenToTimestampIntervalChange(): void {
    this.store.select(selectNetworkTimestampInterval)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(timestamp => !!timestamp.from),
      )
      .subscribe((timestamp: NetworkTimestampInterval) => {
        this.currentTimestamp = timestamp;
        const from = this.datePipe.transform(timestamp.from * 1000, 'MMM d, H:mm:ss');
        let to = this.datePipe.transform(timestamp.to * 1000, 'MMM d, H:mm:ss');
        if (from.split(',')[0] === to.split(',')[0]) {
          to = this.datePipe.transform(timestamp.to * 1000, 'H:mm:ss');
        }
        this.activeInterval = from + ' - ' + to;
        this.detect();
      });
  }

  goLive(): void {
    this.store.dispatch<NetworkGoLive>({ type: NETWORK_GO_LIVE });
  }

  pause(): void {
    this.store.dispatch<NetworkPause>({ type: NETWORK_PAUSE });
  }

  previousPage(): void {
    this.store.dispatch<NetworkGetPaginatedMessages>({
      type: NETWORK_GET_PAGINATED_MESSAGES, payload: {
        id: this.state.activePage.start.id - 1,
        direction: NetworkMessagesDirection.REVERSE,
      },
    });
  }

  nextPage(): void {
    this.store.dispatch<NetworkGetPaginatedMessages>({
      type: NETWORK_GET_PAGINATED_MESSAGES, payload: {
        id: this.state.activePage.end.id + 1,
        direction: NetworkMessagesDirection.FORWARD,
      },
    });
  }

  firstPage(): void {
    this.store.dispatch<NetworkGetPaginatedMessages>({
      type: NETWORK_GET_PAGINATED_MESSAGES,
      payload: {
        id: 0,
        direction: NetworkMessagesDirection.FORWARD,
      },
    });
  }

  lastPage(): void {
    this.store.dispatch<NetworkGetPaginatedMessages>({
      type: NETWORK_GET_PAGINATED_MESSAGES,
      payload: {
        id: this.state.pages[this.state.pages.length - 1] + 1,
        direction: NetworkMessagesDirection.REVERSE,
      },
    });
  }

  openIntervalPicker(event?: MouseEvent): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(event?.target as HTMLElement)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: -35,
        }]),
    });
    event?.stopPropagation();

    const portal = new ComponentPortal(NetworkIntervalSelectComponent);
    this.intervalSelectComponent = this.overlayRef.attach<NetworkIntervalSelectComponent>(portal);
    this.intervalSelectComponent.instance.from = this.currentTimestamp?.from;
    this.intervalSelectComponent.instance.to = this.currentTimestamp?.to;
    setTimeout(() => {
      this.intervalSelectComponent.instance.animate = true;
      this.intervalSelectComponent.instance.detect();
    });
    this.intervalSelectComponent.instance.onConfirm
      .pipe(take(1))
      .subscribe((response: NetworkTimestampInterval) => {
        this.intervalSelectComponent.instance.animate = false;
        this.intervalSelectComponent.instance.detect();
        if (response) {
          this.store.dispatch<NetworkSetTimestampInterval>({
            type: NETWORK_SET_TIMESTAMP_INTERVAL,
            payload: { from: response.from, to: response.to, direction: NetworkMessagesDirection.FORWARD },
          });
        }
        setTimeout(() => this.detachOverlay(), 250);
      });
  }

  detachOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  scrollToTop(): void {
    this.pause();
    this.onScrollTopClick.emit();
  }

  clearTimestampInterval(event: MouseEvent): void {
    event.stopPropagation();
    this.activeInterval = this.currentTimestamp = undefined;
    this.store.dispatch<NetworkSetTimestampInterval>({
      type: NETWORK_SET_TIMESTAMP_INTERVAL,
      payload: { from: undefined, to: undefined, direction: NetworkMessagesDirection.REVERSE },
    });
  }
}
