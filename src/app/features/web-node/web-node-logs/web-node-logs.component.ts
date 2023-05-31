import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { WEB_NODE_LOGS_CLOSE, WebNodeLogsClose } from '@web-node/web-node-logs/web-node-logs.actions';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { WebNodeLogsTableComponent } from '@web-node/web-node-logs/web-node-logs-table/web-node-logs-table.component';
import { selectWebNodeLogsActiveLog } from '@web-node/web-node-logs/web-node-logs.state';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-logs',
  templateUrl: './web-node-logs.component.html',
  styleUrls: ['./web-node-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class WebNodeLogsComponent extends ManualDetection implements OnInit, OnDestroy {

  isActiveRow: boolean;

  private removedClass: boolean;

  @ViewChild(WebNodeLogsTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerOldComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToActiveRowChange();
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectWebNodeLogsActiveLog)
      .pipe(untilDestroyed(this))
      .subscribe((row: WebNodeLog) => {
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

  ngOnDestroy(): void {
    this.store.dispatch<WebNodeLogsClose>({ type: WEB_NODE_LOGS_CLOSE });
  }
}
