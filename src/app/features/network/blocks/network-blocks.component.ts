import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NetworkBlocksClose, NetworkBlocksGetEarliestBlock, NetworkBlocksInit, NetworkBlocksSetActiveBlock } from '@network/blocks/network-blocks.actions';
import { selectAppNodeStatus } from '@app/app.state';
import { filter, take } from 'rxjs';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { NetworkBlocksTableComponent } from '@network/blocks/network-blocks-table/network-blocks-table.component';
import { selectNetworkBlocksSidePanelOpen } from '@network/blocks/network-blocks.state';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-network-blocks',
  templateUrl: './network-blocks.component.html',
  styleUrls: ['./network-blocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100' },
})
export class NetworkBlocksComponent extends StoreDispatcher implements OnInit, AfterViewInit, OnDestroy {

  isSidePanelOpen: boolean;

  private blockHeight: number;
  private removedClass: boolean;

  @ViewChild(NetworkBlocksTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
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
      this.dispatch(NetworkBlocksSetActiveBlock, { height: this.blockHeight });
      this.dispatch(NetworkBlocksInit);
    }, take(1), filter(route => route.params['height']));
  }

  private listenToActiveBlockChangeFromNode(): void {
    this.select(selectAppNodeStatus, (node: NodeStatus) => {
      this.dispatch(NetworkBlocksGetEarliestBlock, node);
    }, filter(Boolean), filter((node: NodeStatus) => node.status !== AppNodeStatusTypes.CONNECTING));
  }

  private listenToSidePanelOpeningChange(): void {
    this.select(selectNetworkBlocksSidePanelOpen, (open: boolean) => {
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
    this.dispatch(NetworkBlocksClose);
  }
}
