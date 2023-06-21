import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { selectWebNodeLogsActiveLog } from '@web-node/web-node-logs/web-node-logs.state';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { WebNodeLogsSelectLog } from '@web-node/web-node-logs/web-node-logs.actions';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { selectWebNodeLogs } from '@web-node/web-node.state';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';

@Component({
  selector: 'mina-web-node-logs-table',
  templateUrl: './web-node-logs-table.component.html',
  styleUrls: ['./web-node-logs-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class WebNodeLogsTableComponent extends MinaTableWrapper<WebNodeLog> implements OnInit {

  protected readonly tableHeads: TableColumnList<WebNodeLog> = [
    { name: 'ID' },
    { name: 'datetime' },
    { name: 'kind' },
    { name: 'summary' },
    { name: 'level' },
  ];

  logs: WebNodeLog[] = [];
  activeLog: WebNodeLog;

  private idFromRoute: number;
  private preselect: boolean;

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToRouteChange();
    this.listenToWebNodeLogsChanges();
    this.listenToActiveLog();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [70, 155, 200, 400, 200];
    this.table.propertyForActiveCheck = 'id';
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['id'] && this.logs.length === 0) {
        this.idFromRoute = Number(route.params['id']);
        this.preselect = true;
      }
    });
  }

  private listenToWebNodeLogsChanges(): void {
    this.select(selectWebNodeLogs, (logs: WebNodeLog[]) => {
      this.logs = logs;
      this.table.rows = logs;
      this.table.detect();
      if (this.preselect) {
        this.dispatch(WebNodeLogsSelectLog, this.logs.find(l => l.id === this.idFromRoute));
        this.preselect = false;
      }
      this.detect();
    }, filter(logs => !!logs?.length));
  }

  private listenToActiveLog(): void {
    this.select(selectWebNodeLogsActiveLog, (log: WebNodeLog) => {
      this.activeLog = log;
      this.table.activeRow = log;
      this.table.detect();
      this.detect();
    }, filter(log => log !== this.activeLog));
  }

  protected override onRowClick(log: WebNodeLog): void {
    if (this.activeLog?.id !== log.id) {
      this.router.navigate([Routes.WEB_NODE, Routes.LOGS, log.id], { queryParamsHandling: 'merge' });
      this.activeLog = log;
      this.selectLog(log);
    }
  }

  private selectLog(log: WebNodeLog): void {
    this.dispatch(WebNodeLogsSelectLog, log);
  }
}
