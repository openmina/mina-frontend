import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NetworkBlocksClose, NetworkBlocksGetEarliestBlock, NetworkBlocksInit, NetworkBlocksSetActiveBlock } from '@network/blocks/network-blocks.actions';
import { selectAppNodeStatus } from '@app/app.state';
import { filter, take } from 'rxjs';
import { NodeStatus } from '@shared/types/app/node-status.type';
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

  constructor(public el: ElementRef) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToActiveBlockChangeFromNode();
  }

  ngAfterViewInit(): void {
    this.listenToSidePanelOpeningChange();
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
      this.detect();
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(NetworkBlocksClose);
  }
}
