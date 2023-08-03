import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswWorkPoolActiveWorkPool } from '@dsw/work-pool/dsw-work-pool.state';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { DswWorkPoolSetActiveWorkPool, DswWorkPoolToggleSidePanel } from '@dsw/work-pool/dsw-work-pool.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';

@Component({
  selector: 'mina-dsw-work-pool-side-panel',
  templateUrl: './dsw-work-pool-side-panel.component.html',
  styleUrls: ['./dsw-work-pool-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class DswWorkPoolSidePanelComponent extends StoreDispatcher implements OnInit {

  activeWorkPool: WorkPool;
  activeScreen: number = 0;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToActiveNode();
  }

  private listenToActiveNode(): void {
    this.select(selectDswWorkPoolActiveWorkPool, (wp: WorkPool) => {
      this.activeWorkPool = wp;
      if (this.activeWorkPool) {
        this.activeScreen = 1;
      } else {
        this.activeScreen = 0;
      }
      this.detect();
    });
  }

  toggleSidePanel(): void {
    this.router.navigate([Routes.SNARK_WORKER, Routes.WORK_POOL], { queryParamsHandling: 'merge' });
    this.dispatch(DswWorkPoolToggleSidePanel);
  }

  removeActiveWorkPool(): void {
    this.dispatch(DswWorkPoolSetActiveWorkPool, { id: undefined });
    this.router.navigate([Routes.SNARK_WORKER, Routes.WORK_POOL], { queryParamsHandling: 'merge' });
  }
}
