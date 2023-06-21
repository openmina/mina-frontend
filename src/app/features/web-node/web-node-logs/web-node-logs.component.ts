import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { WebNodeLogsClose } from '@web-node/web-node-logs/web-node-logs.actions';
import { selectWebNodeLogsActiveLog } from '@web-node/web-node-logs/web-node-logs.state';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { WebNodeSharedGetLogs } from '@web-node/web-node.actions';

@Component({
  selector: 'mina-web-node-logs',
  templateUrl: './web-node-logs.component.html',
  styleUrls: ['./web-node-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class WebNodeLogsComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveRow: boolean;

  constructor(public el: ElementRef<HTMLElement>) { super(); }

  ngOnInit(): void {
    this.dispatch(WebNodeSharedGetLogs);
    this.listenToActiveRowChange();
  }

  private listenToActiveRowChange(): void {
    this.select(selectWebNodeLogsActiveLog, (row: WebNodeLog) => {
      if (row && !this.isActiveRow) {
        this.isActiveRow = true;
        this.detect();
      } else if (!row && this.isActiveRow) {
        this.isActiveRow = false;
        this.detect();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(WebNodeLogsClose);
  }
}
