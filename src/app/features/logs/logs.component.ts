import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';
import { LogsClose, LogsGetLogs } from '@logs/logs.actions';
import { selectActiveLog } from '@logs/logs.state';
import { Log } from '@shared/types/logs/log.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveRow: boolean;

  ngOnInit(): void {
    this.getLogs();
    this.listenToActiveRowChange();
  }

  private getLogs(): void {
    timer(0, 10000).pipe(
      untilDestroyed(this),
    ).subscribe(() =>
      this.dispatch(LogsGetLogs),
    );
  }

  private listenToActiveRowChange(): void {
    this.select(selectActiveLog, (row: Log) => {
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
    this.dispatch(LogsClose);
  }
}
