import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import {
  NETWORK_BLOCKS_CLOSE,
  NETWORK_BLOCKS_GET_EARLIEST_BLOCK,
  NETWORK_BLOCKS_INIT,
  NETWORK_BLOCKS_SET_ACTIVE_BLOCK,
  NetworkBlocksClose,
  NetworkBlocksGetEarliestBlock,
  NetworkBlocksInit,
  NetworkBlocksSetActiveBlock,
} from '@network/blocks/network-blocks.actions';
import { selectAppNodeStatus } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from 'rxjs';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { NetworkBlocksTableComponent } from '@network/blocks/network-blocks-table/network-blocks-table.component';
import { selectNetworkBlocksSidePanelOpen } from '@network/blocks/network-blocks.state';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks',
  templateUrl: './network-blocks.component.html',
  styleUrls: ['./network-blocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100' },
})
export class NetworkBlocksComponent extends ManualDetection implements OnInit, AfterViewInit, OnDestroy {

  isSidePanelOpen: boolean;

  private blockHeight: number;
  private removedClass: boolean;

  @ViewChild(NetworkBlocksTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
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
        this.store.dispatch<NetworkBlocksSetActiveBlock>({
          type: NETWORK_BLOCKS_SET_ACTIVE_BLOCK,
          payload: { height: this.blockHeight },
        });
        this.store.dispatch<NetworkBlocksInit>({ type: NETWORK_BLOCKS_INIT });
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
        this.store.dispatch<NetworkBlocksGetEarliestBlock>({ type: NETWORK_BLOCKS_GET_EARLIEST_BLOCK, payload: node });
      });
  }

  private listenToSidePanelOpeningChange(): void {
    this.store.select(selectNetworkBlocksSidePanelOpen)
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
    this.store.dispatch<NetworkBlocksClose>({ type: NETWORK_BLOCKS_CLOSE });
  }
}
