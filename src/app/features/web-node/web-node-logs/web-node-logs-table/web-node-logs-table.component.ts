import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectWebNodeLogsActiveLog } from '@web-node/web-node-logs/web-node-logs.state';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { WEB_NODE_LOGS_SELECT_LOG, WebNodeLogsSelectLog } from '@web-node/web-node-logs/web-node-logs.actions';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { selectWebNodeLogs } from '@web-node/web-node.state';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-logs-table',
  templateUrl: './web-node-logs-table.component.html',
  styleUrls: ['./web-node-logs-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class WebNodeLogsTableComponent extends ManualDetection implements OnInit {

  logs: WebNodeLog[] = [];
  activeLog: WebNodeLog;

  private idFromRoute: number;
  private preselect: boolean;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToWebNodeLogsChanges();
    this.listenToActiveLog();
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this))
      .subscribe((route: MergedRoute) => {
        if (route.params['id'] && this.logs.length === 0) {
          this.idFromRoute = Number(route.params['id']);
          this.preselect = true;
        }
      });
  }

  private listenToWebNodeLogsChanges(): void {
    this.store.select(selectWebNodeLogs)
      .pipe(
        untilDestroyed(this),
        filter(logs => !!logs?.length),
      )
      .subscribe((logs: WebNodeLog[]) => {
        this.logs = logs;
        if (this.preselect) {
          this.store.dispatch<WebNodeLogsSelectLog>({
            type: WEB_NODE_LOGS_SELECT_LOG,
            payload: this.logs.find(l => l.id === this.idFromRoute),
          });
          this.preselect = false;
        }
        this.detect();
      });
  }

  private listenToActiveLog(): void {
    this.store.select(selectWebNodeLogsActiveLog)
      .pipe(
        untilDestroyed(this),
        filter(log => log !== this.activeLog),
      )
      .subscribe((log: WebNodeLog) => {
        this.activeLog = log;
        this.detect();
      });
  }

  onRowClick(log: WebNodeLog): void {
    if (this.activeLog?.id !== log.id) {
      this.router.navigate([Routes.WEB_NODE, Routes.LOGS, log.id], { queryParamsHandling: 'merge' });
      this.activeLog = log;
      this.selectLog(log);
    }
  }

  private selectLog(log: WebNodeLog): void {
    this.store.dispatch<WebNodeLogsSelectLog>({ type: WEB_NODE_LOGS_SELECT_LOG, payload: log });
  }
}
