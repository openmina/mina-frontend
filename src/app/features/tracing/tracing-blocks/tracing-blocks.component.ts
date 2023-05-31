import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TracingBlocksTableComponent } from '@tracing/tracing-blocks/tracing-blocks-table/tracing-blocks-table.component';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { TracingBlocksClose, TracingBlocksGetTraces } from '@tracing/tracing-blocks/tracing-blocks.actions';
import { selectTracingActiveTrace } from '@tracing/tracing-blocks/tracing-blocks.state';
import { selectActiveNode } from '@app/app.state';
import { filter } from 'rxjs';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-tracing-blocks',
  templateUrl: './tracing-blocks.component.html',
  styleUrls: ['./tracing-blocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100' },
})
export class TracingBlocksComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveTrace: boolean;

  private removedClass: boolean;

  @ViewChild(TracingBlocksTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerOldComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.listenToActiveNodeChange();
    this.listenToActiveRowChange();
  }

  private listenToActiveNodeChange(): void {
    this.select(selectActiveNode, () => {
      this.dispatch(TracingBlocksGetTraces);
    }, filter(Boolean));
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToActiveRowChange(): void {
    this.select(selectTracingActiveTrace, (row: TracingBlockTrace) => {
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(TracingBlocksClose);
  }
}
