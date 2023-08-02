import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ExpandTracking, MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { selectDswWorkPoolActiveWorkPool } from '@dsw/work-pool/dsw-work-pool.state';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { DswWorkPoolSetActiveWorkPool } from '@dsw/work-pool/dsw-work-pool.actions';
import { downloadJson } from '@app/shared/helpers/user-input.helper';
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
  expandTracking: ExpandTracking = {};
  jsonString: string;

  @ViewChild(MinaJsonViewerComponent) private minaJsonViewer: MinaJsonViewerComponent;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.select(selectDswWorkPoolActiveWorkPool, (wp: WorkPool) => {
      this.activeWorkPool = { ...wp };
      delete this.activeWorkPool.types;
      delete this.activeWorkPool.typesSort;
      this.jsonString = JSON.stringify(this.activeWorkPool);
      this.detect();
    });
  }

  closeSidePanel(): void {
    this.dispatch(DswWorkPoolSetActiveWorkPool, { id: undefined });
    this.router.navigate([Routes.SNARK_WORKER, Routes.WORK_POOL], { queryParamsHandling: 'merge' });
  }

  downloadJson(): void {
    downloadJson(this.jsonString, 'work-pool.json');
  }

  expandEntireJSON(): void {
    this.expandTracking = this.minaJsonViewer.toggleAll(true);
  }

  collapseEntireJSON(): void {
    this.expandTracking = this.minaJsonViewer.toggleAll(false);
  }
}
