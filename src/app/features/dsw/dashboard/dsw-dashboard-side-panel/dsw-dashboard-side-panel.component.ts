import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswDashboardActiveNode } from '@dsw/dashboard/dsw-dashboard.state';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { DswDashboardSetActiveNode } from '@dsw/dashboard/dsw-dashboard.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';

@Component({
  selector: 'mina-dsw-dashboard-side-panel',
  templateUrl: './dsw-dashboard-side-panel.component.html',
  styleUrls: ['./dsw-dashboard-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DswDashboardSidePanelComponent extends StoreDispatcher implements OnInit {

  node: DswDashboardNode;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToActiveDswDashboardNode();
  }

  private listenToActiveDswDashboardNode(): void {
    this.select(selectDswDashboardActiveNode, (node: DswDashboardNode) => {
      this.node = node;
      this.detect();
    });
  }

  closeSidePanel(): void {
    this.dispatch(DswDashboardSetActiveNode, undefined);
    this.router.navigate([Routes.SNARK_WORKER, Routes.DASHBOARD], { queryParamsHandling: 'merge' });
  }
}
