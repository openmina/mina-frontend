import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { TracingBlocksTableComponent } from '@tracing/tracing-blocks/tracing-blocks-table/tracing-blocks-table.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { TRACING_BLOCKS_CLOSE, TRACING_BLOCKS_GET_TRACES, TracingBlocksClose, TracingBlocksGetTraces } from '@tracing/tracing-blocks/tracing-blocks.actions';
import { selectTracingActiveTrace } from '@tracing/tracing-blocks/tracing-blocks.state';
import { selectActiveNode } from '@app/app.state';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mina-tracing-blocks',
  templateUrl: './tracing-blocks.component.html',
  styleUrls: ['./tracing-blocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100' },
})
export class TracingBlocksComponent extends ManualDetection implements OnInit, OnDestroy {

  isActiveTrace: boolean;

  private removedClass: boolean;

  @ViewChild(TracingBlocksTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToActiveNodeChange();
    this.listenToActiveRowChange();
  }

  private listenToActiveNodeChange(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe(() => {
        this.store.dispatch<TracingBlocksGetTraces>({ type: TRACING_BLOCKS_GET_TRACES });
      });
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectTracingActiveTrace)
      .pipe(untilDestroyed(this))
      .subscribe((row: TracingBlockTrace) => {
        if (row && !this.isActiveTrace) {
          this.isActiveTrace = true;
          if (!this.removedClass) {
            this.removedClass = true;
            this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
          }
          this.detect();
        } else if (!row && this.isActiveTrace) {
          this.isActiveTrace = false;
          this.detect();
        }
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<TracingBlocksClose>({ type: TRACING_BLOCKS_CLOSE });
  }
}
