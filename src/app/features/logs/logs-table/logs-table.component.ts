import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Log } from '@shared/types/logs/log.type';
import { selectActiveLog, selectLogs } from '@logs/logs.state';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import { LogsSetActiveLog } from '@logs/logs.actions';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-logs-table',
  templateUrl: './logs-table.component.html',
  styleUrls: ['./logs-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column' },
})
export class LogsTableComponent extends StoreDispatcher implements OnInit {

  readonly itemSize: number = 32;

  logs: Log[];
  activeLog: Log;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToActiveRowChange();
    this.listenToLogsChange();
  }

  private listenToActiveRowChange(): void {
    this.select(selectActiveLog, (log: Log) => {
      this.activeLog = log;
      this.detect();
    });
  }

  private listenToLogsChange(): void {
    this.select(selectLogs, (logs: Log[]) => {
      this.logs = logs;
      this.detect();
    });
  }

  onRowClick(log: Log): void {
    if (log !== this.activeLog) {
      this.router.navigate([Routes.LOGS, log.timestamp], { queryParamsHandling: 'merge' });
      this.dispatch(LogsSetActiveLog, log);
    }
  }
}
