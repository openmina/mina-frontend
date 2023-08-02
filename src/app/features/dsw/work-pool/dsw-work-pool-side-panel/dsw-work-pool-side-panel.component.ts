import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ExpandTracking } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { selectDswWorkPoolActiveWorkPool } from '@dsw/work-pool/dsw-work-pool.state';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { DswWorkPoolSetActiveWorkPool } from '@dsw/work-pool/dsw-work-pool.actions';

@Component({
  selector: 'mina-dsw-work-pool-side-panel',
  templateUrl: './dsw-work-pool-side-panel.component.html',
  styleUrls: ['./dsw-work-pool-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswWorkPoolSidePanelComponent extends StoreDispatcher implements OnInit {

  activeWorkPool: WorkPool;
  expandTracking: ExpandTracking = {};

  ngOnInit(): void {
    this.select(selectDswWorkPoolActiveWorkPool, (wp: WorkPool) => {
      this.activeWorkPool = { ...wp };
      delete this.activeWorkPool.types;
      delete this.activeWorkPool.typesSort;
      this.detect();
    });
  }

  closeSidePanel(): void {
    this.dispatch(DswWorkPoolSetActiveWorkPool, undefined);
  }
}
