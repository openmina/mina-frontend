import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswLiveActiveNode, selectDswLiveNodes } from '@dsw/live/dsw-live.state';
import { DswLiveNode } from '@shared/types/dsw/live/dsw-live-node.type';
import { DswLiveSetActiveNode } from '@dsw/live/dsw-live.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { filter, take } from 'rxjs';

@Component({
  selector: 'mina-dsw-live-toolbar',
  templateUrl: './dsw-live-toolbar.component.html',
  styleUrls: ['./dsw-live-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-lg fx-row-vert-cent' },
})
export class DswLiveToolbarComponent extends StoreDispatcher implements OnInit {

  node: DswLiveNode = {} as DswLiveNode;

  nodes: DswLiveNode[] = [];
  private tipFromRoute: string;

  constructor(private router: Router) {super();}

  ngOnInit(): void {
    this.listenToBestTip();
    this.listenToNodes();
    this.listenToRoute();
  }

  private listenToRoute(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['bestTip']) {
        this.tipFromRoute = route.params['bestTip'];
      }
    }, take(1));
  }

  private listenToBestTip(): void {
    this.select(selectDswLiveActiveNode, (node: DswLiveNode) => {
      this.node = node;
      this.detect();
    }, filter(Boolean));
  }

  selectPreviousNode(): void {
    const index = this.nodes.findIndex((node: DswLiveNode) => node.bestTip === this.node.bestTip);
    const previous = this.nodes[index - 1];
    if (previous) {
      this.selectNode(previous.bestTip);
    }
  }

  selectNextNode(): void {
    const index = this.nodes.findIndex((node: DswLiveNode) => node.bestTip === this.node.bestTip);
    const next = this.nodes[index + 1];
    if (next) {
      this.selectNode(next.bestTip);
    }
  }

  selectNode(hash: string): void {
    this.dispatch(DswLiveSetActiveNode, { hash });
    this.router.navigate([Routes.SNARK_WORKER, Routes.LIVE, hash], { queryParamsHandling: 'merge' });
  }

  private listenToNodes(): void {
    this.select(selectDswLiveNodes, (nodes: DswLiveNode[]) => {
      this.nodes = nodes;
      if (this.tipFromRoute) {
        this.selectNode(this.tipFromRoute);
        delete this.tipFromRoute;
      }
      this.detect();
    }, filter(Boolean));
  }

  selectLastTip(): void {
    this.selectNode(this.nodes[this.nodes.length - 1].bestTip);
  }

  selectFirstTip(): void {
    this.selectNode(this.nodes[0].bestTip);
  }
}
