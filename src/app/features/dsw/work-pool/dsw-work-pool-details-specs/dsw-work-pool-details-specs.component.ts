import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ExpandTracking, MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { selectDswWorkPoolActiveWorkPoolSpecs } from '@dsw/work-pool/dsw-work-pool.state';
import { WorkPoolSpecs } from '@shared/types/dsw/work-pool/work-pool-specs.type';
import { downloadJson } from '@shared/helpers/user-input.helper';

@Component({
  selector: 'mina-dsw-work-pool-details-specs',
  templateUrl: './dsw-work-pool-details-specs.component.html',
  styleUrls: ['./dsw-work-pool-details-specs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswWorkPoolDetailsSpecsComponent extends StoreDispatcher implements OnInit {

  activeWorkPool: WorkPoolSpecs;
  expandTracking: ExpandTracking = {};
  jsonString: string;

  @ViewChild(MinaJsonViewerComponent) private minaJsonViewer: MinaJsonViewerComponent;

  ngOnInit(): void {
    this.select(selectDswWorkPoolActiveWorkPoolSpecs, (wp: WorkPoolSpecs) => {
      this.activeWorkPool = { ...wp };
      this.jsonString = JSON.stringify(this.activeWorkPool);
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
