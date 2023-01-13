import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from 'rxjs';
import { MergedRoute } from '@shared/router/merged-route';
import { selectAppNodeStatus } from '@app/app.state';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import {
  NETWORK_BLOCKS_IPC_CLOSE,
  NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK,
  NETWORK_BLOCKS_IPC_INIT,
  NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK,
  NetworkBlocksIpcClose,
  NetworkBlocksIpcGetEarliestBlock,
  NetworkBlocksIpcInit,
  NetworkBlocksIpcSetActiveBlock,
} from './network-blocks-ipc.actions';
import { selectNetworkBlocksIpcSidePanelOpen } from './network-blocks-ipc.state';
import { NetworkBlocksIpcTableComponent } from '@network/blocks-ipc/network-blocks-ipc-table/network-blocks-ipc-table.component';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks-ipc',
  templateUrl: './network-blocks-ipc.component.html',
  styleUrls: ['./network-blocks-ipc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100' },
})
export class NetworkBlocksIpcComponent extends ManualDetection implements OnInit, AfterViewInit, OnDestroy {

  isSidePanelOpen: boolean;

  private blockHeight: number;
  private removedClass: boolean;

  @ViewChild(NetworkBlocksIpcTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  constructor(private store: Store<MinaState>) { super(); }

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
    this.store.select(getMergedRoute)
      .pipe(
        untilDestroyed(this),
        take(1),
        filter(route => route.params['height']),
      )
      .subscribe((route: MergedRoute) => {
        this.blockHeight = Number(route.params['height']);
        this.store.dispatch<NetworkBlocksIpcSetActiveBlock>({
          type: NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK,
          payload: { height: this.blockHeight },
        });
        this.store.dispatch<NetworkBlocksIpcInit>({ type: NETWORK_BLOCKS_IPC_INIT });
      });
  }

  private listenToActiveBlockChangeFromNode(): void {
    this.store.select(selectAppNodeStatus)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter((node: NodeStatus) => node.status !== AppNodeStatusTypes.CONNECTING),
      )
      .subscribe((node: NodeStatus) => {
        this.store.dispatch<NetworkBlocksIpcGetEarliestBlock>({ type: NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK, payload: node });
      });
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

  ngOnDestroy(): void {
    this.store.dispatch<NetworkBlocksIpcClose>({ type: NETWORK_BLOCKS_IPC_CLOSE });
  }
}
