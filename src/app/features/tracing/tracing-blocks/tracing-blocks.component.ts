import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
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

  constructor(public el: ElementRef<HTMLElement>) { super(); }

  ngOnInit(): void {
    this.listenToActiveNodeChange();
    this.listenToActiveRowChange();
  }

  private listenToActiveNodeChange(): void {
    this.select(selectActiveNode, () => {
      this.dispatch(TracingBlocksGetTraces);
    }, filter(Boolean));
  }

  private listenToActiveRowChange(): void {
    this.select(selectTracingActiveTrace, (row: TracingBlockTrace) => {
      if (row && !this.isActiveTrace) {
        this.isActiveTrace = true;
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
