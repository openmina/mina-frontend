import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from 'rxjs';
import { MergedRoute } from '@shared/router/merged-route';
import { selectAppNodeStatus } from '@app/app.state';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { NetworkBlocksIpcClose, NetworkBlocksIpcGetEarliestBlock, NetworkBlocksIpcInit, NetworkBlocksIpcSetActiveBlock } from './network-blocks-ipc.actions';
import { selectNetworkBlocksIpcSidePanelOpen } from './network-blocks-ipc.state';
import { NetworkBlocksIpcTableComponent } from '@network/blocks-ipc/network-blocks-ipc-table/network-blocks-ipc-table.component';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-network-blocks-ipc',
  templateUrl: './network-blocks-ipc.component.html',
  styleUrls: ['./network-blocks-ipc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100' },
})
export class NetworkBlocksIpcComponent extends StoreDispatcher implements OnInit, AfterViewInit, OnDestroy {

  isSidePanelOpen: boolean;

  private blockHeight: number;
  private removedClass: boolean;

  @ViewChild(NetworkBlocksIpcTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerOldComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToActiveBlockChangeFromNode();
  }

  ngAfterViewInit(): void {
    this.listenToSidePanelOpeningChange();
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      this.blockHeight = Number(route.params['height']);
      this.dispatch(NetworkBlocksIpcSetActiveBlock, { height: this.blockHeight });
      this.dispatch(NetworkBlocksIpcInit);
    }, take(1), filter(route => route.params['height']));
  }

  private listenToActiveBlockChangeFromNode(): void {
    this.select(selectAppNodeStatus, (node: NodeStatus) => {
      this.dispatch(NetworkBlocksIpcGetEarliestBlock, node);
    }, filter(Boolean), filter((node: NodeStatus) => node.status !== AppNodeStatusTypes.CONNECTING));
  }

  private listenToSidePanelOpeningChange(): void {
    this.store.select(selectNetworkBlocksIpcSidePanelOpen)
      .pipe(untilDestroyed(this))
      .subscribe((open: boolean) => {
        this.isSidePanelOpen = open;
        if (!this.removedClass) {
          this.removedClass = true;
          this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
        }
        this.detect();
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(NetworkBlocksIpcClose);
  }
}
