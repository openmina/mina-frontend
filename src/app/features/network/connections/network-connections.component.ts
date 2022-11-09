import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { NetworkConnectionsTableComponent } from '@network/connections/network-connections-table/network-connections-table.component';
import {
  NETWORK_CONNECTIONS_CLOSE,
  NETWORK_CONNECTIONS_INIT,
  NetworkConnectionsClose,
  NetworkConnectionsInit,
} from '@network/connections/network-connections.actions';
import { selectNetworkConnectionsActiveConnection } from '@network/connections/network-connections.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkConnection } from '@shared/types/network/connections/network-connection.type';

@UntilDestroy()
@Component({
  selector: 'mina-network-connections',
  templateUrl: './network-connections.component.html',
  styleUrls: ['./network-connections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class NetworkConnectionsComponent extends ManualDetection implements OnInit, OnDestroy {

  isActiveRow: boolean = false;

  private removedClass: boolean;

  @ViewChild(NetworkConnectionsTableComponent) private tableComponent: NetworkConnectionsTableComponent;
  @ViewChild(NetworkConnectionsTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToActiveRowChange();
    this.store.dispatch<NetworkConnectionsInit>({ type: NETWORK_CONNECTIONS_INIT });
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectNetworkConnectionsActiveConnection)
      .pipe(untilDestroyed(this))
      .subscribe((row: NetworkConnection) => {
        if (row && !this.isActiveRow) {
          this.isActiveRow = true;
          if (!this.removedClass) {
            this.removedClass = true;
            this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
          }
          this.detect();
        } else if (!row && this.isActiveRow) {
          this.isActiveRow = false;
          this.detect();
        }
      });
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  checkVirtualScrollViewport(): void {
    this.tableComponent.scrollViewport.checkViewportSize();
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  scrollToTop(): void {
    this.tableComponent.scrollViewport.scrollToIndex(0);
  }

  ngOnDestroy(): void {
    this.store.dispatch<NetworkConnectionsClose>({ type: NETWORK_CONNECTIONS_CLOSE });
  }
}
