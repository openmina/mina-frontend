import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ExpandTracking, MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { downloadJson } from '@shared/helpers/user-input.helper';

@Component({
  selector: 'mina-dsw-work-pool-details-accounts',
  templateUrl: './dsw-work-pool-details-accounts.component.html',
  styleUrls: ['./dsw-work-pool-details-accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswWorkPoolDetailsAccountsComponent extends StoreDispatcher implements OnChanges {

  @Input() accounts: any[];

  expandTracking: ExpandTracking = {};
  jsonString: string;

  @ViewChild(MinaJsonViewerComponent) private minaJsonViewer: MinaJsonViewerComponent;

  ngOnChanges(): void {
    this.jsonString = JSON.stringify(this.accounts);
  }

  downloadJson(): void {
    downloadJson(this.jsonString, 'work-pool-accounts.json');
  }

  expandEntireJSON(): void {
    this.expandTracking = this.minaJsonViewer.toggleAll(true);
  }

  collapseEntireJSON(): void {
    this.expandTracking = this.minaJsonViewer.toggleAll(false);
  }

}
