import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';
import { LogsClose, LogsGetLogs } from '@logs/logs.actions';
import { HorizontalResizableContainerOldComponent } from '../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { LogsTableComponent } from '@logs/logs-table/logs-table.component';
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

  private removedClass: boolean;

  @ViewChild(LogsTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerOldComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

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

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToActiveRowChange(): void {
    this.select(selectActiveLog, (row: Log) => {
      if (row && !this.isActiveRow) {
        this.isActiveRow = true;
        if (!this.removedClass) {
          this.removedClass = true;
          this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
        }
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
