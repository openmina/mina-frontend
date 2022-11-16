import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { WebNodeService } from '@web-node/web-node.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { downloadJson } from '@app/shared/helpers/user-input.helper';
import { ExpandTracking, MinaJsonViewerComponent } from '@shared/components/custom-components/mina-json-viewer/mina-json-viewer.component';

@Component({
  selector: 'mina-web-node-state',
  templateUrl: './web-node-state.component.html',
  styleUrls: ['./web-node-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class WebNodeStateComponent extends ManualDetection implements OnInit {

  json: any = {};
  jsonString: string;
  expandTracking: ExpandTracking = {};

  @ViewChild(MinaJsonViewerComponent) private minaJsonViewer: MinaJsonViewerComponent;

  constructor(private webNodeService: WebNodeService) { super(); }

  ngOnInit(): void {
    this.webNodeService.globalState.subscribe(state => {
      this.json = state;
      this.jsonString = JSON.stringify(state);
      this.detect();
    });
  }

  downloadJson(): void {
    downloadJson(this.jsonString, 'web-node-state.json');
  }

  expandEntireJSON(): void {
    this.expandTracking = this.minaJsonViewer.toggleAll(true);
  }

  collapseEntireJSON(): void {
    this.expandTracking = this.minaJsonViewer.toggleAll(false);
  }
}
