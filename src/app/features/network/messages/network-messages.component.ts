import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NetworkMessagesTableComponent } from '@network/messages/network-messages-table/network-messages-table.component';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkActiveRow } from '@network/messages/network-messages.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkMessage } from '@shared/types/network/messages/network-message.type';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { NETWORK_CLOSE, NETWORK_INIT, NetworkMessagesClose, NetworkMessagesInit } from '@network/messages/network-messages.actions';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { APP_UPDATE_DEBUGGER_STATUS, AppUpdateDebuggerStatus } from '@app/app.actions';
import { selectActiveNode } from '@app/app.state';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mina-network-messages',
  templateUrl: './network-messages.component.html',
  styleUrls: ['./network-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class NetworkMessagesComponent extends ManualDetection implements OnInit, OnDestroy {

  isActiveRow: boolean;

  private removedClass: boolean;

  @ViewChild(NetworkMessagesTableComponent) private tableComponent: NetworkMessagesTableComponent;
  @ViewChild(NetworkMessagesTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToActiveRowChange();
    this.listenToActiveNodeChange();
  }

  private listenToActiveNodeChange(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe(() => {
        this.store.dispatch<NetworkMessagesInit>({ type: NETWORK_INIT });
      });
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectNetworkActiveRow)
      .pipe(untilDestroyed(this))
      .subscribe((row: NetworkMessage) => {
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
    this.store.dispatch<AppUpdateDebuggerStatus>({ type: APP_UPDATE_DEBUGGER_STATUS, payload: { failed: undefined } });
    this.store.dispatch<NetworkMessagesClose>({ type: NETWORK_CLOSE });
  }
}
