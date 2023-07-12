import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { Router } from '@angular/router';
import { selectDswBootstrapActiveNode, selectDswBootstrapNodes } from '@dsw/bootstrap/dsw-bootstrap.state';
import { DswBootstrapNode } from '@shared/types/dsw/bootstrap/dsw-bootstrap-node.type';
import { DswBootstrapSetActiveBlock, DswBootstrapToggleSidePanel } from '@dsw/bootstrap/dsw-bootstrap.actions';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { Routes } from '@shared/enums/routes.enum';

@Component({
  selector: 'mina-dsw-bootstrap-side-panel',
  templateUrl: './dsw-bootstrap-side-panel.component.html',
  styleUrls: ['./dsw-bootstrap-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class DswBootstrapSidePanelComponent extends StoreDispatcher implements OnInit {

  activeNode: DswBootstrapNode;
  activeScreen: number = 0;
  activeNodeIndex: number = 0;
  nodesCount: number = 0;

  private nodes: DswBootstrapNode[] = [];

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToActiveNode();
    this.listenToNodes();
  }

  private listenToActiveNode(): void {
    this.select(selectDswBootstrapActiveNode, (activeNode: DswBootstrapNode) => {
      this.activeNode = activeNode;
      if (this.activeNode) {
        this.activeScreen = 1;
        this.getActiveNodeIndex();
      } else {
        this.activeScreen = 0;
      }
      this.detect();
    });
  }

  private listenToNodes(): void {
    this.select(selectDswBootstrapNodes, (nodes: DswBootstrapNode[]) => {
      this.nodesCount = nodes.length;
      this.nodes = nodes;
      this.getActiveNodeIndex();
      this.detect();
    });
  }

  private getActiveNodeIndex(): void {
    this.activeNodeIndex = this.nodes.indexOf(this.activeNode);
  }

  toggleSidePanel(): void {
    this.dispatch(DswBootstrapToggleSidePanel);
  }

  removeActiveNode(): void {
    this.dispatch(DswBootstrapSetActiveBlock, undefined);
    this.router.navigate([Routes.SNARK_WORKER, Routes.BOOTSTRAP], { queryParamsHandling: 'merge' });
  }
}
