import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { ExpandTracking, MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { selectDswWorkPoolActiveWorkPool } from '@dsw/work-pool/dsw-work-pool.state';
import { downloadJson } from '@shared/helpers/user-input.helper';

@Component({
  selector: 'mina-dsw-work-pool-details-overview',
  templateUrl: './dsw-work-pool-details-overview.component.html',
  styleUrls: ['./dsw-work-pool-details-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DswWorkPoolDetailsOverviewComponent extends StoreDispatcher implements OnInit {

  activeWorkPool: WorkPool;
  expandTracking: ExpandTracking = {};
  jsonString: string;

  @ViewChild(MinaJsonViewerComponent) private minaJsonViewer: MinaJsonViewerComponent;

  ngOnInit(): void {
    this.select(selectDswWorkPoolActiveWorkPool, (wp: WorkPool) => {
      this.activeWorkPool = { ...wp };
      this.jsonString = JSON.stringify(this.activeWorkPool);
      delete this.activeWorkPool.snarkRecLatency;
      delete this.activeWorkPool.snarkOrigin;
      delete this.activeWorkPool.commitmentRecLatency;
      delete this.activeWorkPool.commitmentOrigin;
      this.detect();
    });
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
