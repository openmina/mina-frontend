import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NetworkMessagesTableComponent } from '@network/messages/network-messages-table/network-messages-table.component';
import { selectNetworkActiveRow } from '@network/messages/network-messages.state';
import { NetworkMessage } from '@shared/types/network/messages/network-message.type';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { NetworkMessagesClose, NetworkMessagesInit } from '@network/messages/network-messages.actions';
import { AppUpdateDebuggerStatus } from '@app/app.actions';
import { selectActiveNode } from '@app/app.state';
import { filter } from 'rxjs';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-network-messages',
  templateUrl: './network-messages.component.html',
  styleUrls: ['./network-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class NetworkMessagesComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveRow: boolean;

  private removedClass: boolean;

  @ViewChild(NetworkMessagesTableComponent) private tableComponent: NetworkMessagesTableComponent;
  @ViewChild(NetworkMessagesTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerOldComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.listenToActiveRowChange();
    this.listenToActiveNodeChange();
  }

  private listenToActiveNodeChange(): void {
    this.select(selectActiveNode, () => {
      this.dispatch(NetworkMessagesInit);
    }, filter(Boolean));
  }

  private listenToActiveRowChange(): void {
    this.select(selectNetworkActiveRow, (row: NetworkMessage) => {
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
    this.tableComponent.table.virtualScroll.checkViewportSize();
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  scrollToTop(): void {
    this.tableComponent.table.virtualScroll.scrollToIndex(0);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(AppUpdateDebuggerStatus, { failed: undefined });
    this.dispatch(NetworkMessagesClose);
  }
}
