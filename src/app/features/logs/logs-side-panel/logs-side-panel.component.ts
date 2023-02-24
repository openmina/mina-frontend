import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectActiveLog } from '@logs/logs.state';
import { Log } from '@shared/types/logs/log.type';
import { ExpandTracking } from '@shared/components/custom-components/mina-json-viewer/mina-json-viewer.component';
import { LogsSetActiveLog } from '@logs/logs.actions';

@Component({
  selector: 'mina-logs-side-panel',
  templateUrl: './logs-side-panel.component.html',
  styleUrls: ['./logs-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsSidePanelComponent extends StoreDispatcher implements OnInit {

  activeLog: Log;
  expandTracking: ExpandTracking = {};

  ngOnInit(): void {
    this.select(selectActiveLog, (log: Log) => {
      this.activeLog = log;
      this.detect();
    });
  }

  closeSidePanel(): void {
    this.dispatch(LogsSetActiveLog, undefined);
  }
}
