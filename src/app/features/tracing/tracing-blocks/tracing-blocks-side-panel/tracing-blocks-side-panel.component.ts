import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { selectTracingActiveTraceDetails, selectTracingActiveTraceGroups } from '@tracing/tracing-blocks/tracing-blocks.state';
import { TRACING_BLOCKS_SELECT_ROW, TracingBlocksSelectRow } from '@tracing/tracing-blocks/tracing-blocks.actions';
import { BlockStructuredTraceComponent } from '@shared/components/block-structured-trace/block-structured-trace.component';

@UntilDestroy()
@Component({
  selector: 'mina-tracing-blocks-side-panel',
  templateUrl: './tracing-blocks-side-panel.component.html',
  styleUrls: ['./tracing-blocks-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracingBlocksSidePanelComponent extends ManualDetection implements OnInit {

  @ViewChild('traces', { read: ViewContainerRef })
  private blockStructuredTrace: ViewContainerRef;
  private component: BlockStructuredTraceComponent;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/block-structured-trace/block-structured-trace.component').then(c => {
      this.component = this.blockStructuredTrace.createComponent<BlockStructuredTraceComponent>(c.BlockStructuredTraceComponent).instance;
      this.component.closeEmitter$.pipe(untilDestroyed(this)).subscribe(() => this.closeSidePanel());
    });
    this.listenToActiveTraceChange();
  }

  private listenToActiveTraceChange(): void {
    this.store.select(selectTracingActiveTraceDetails)
      .pipe(
        untilDestroyed(this),
        filter(t => !!t.activeTrace),
      )
      .subscribe((trace: { activeTrace: TracingBlockTrace; activeTraceGroups: TracingTraceGroup[] }) => {
        this.component.title = trace.activeTrace.source + ' Transition ' + trace.activeTrace.height + ' - ' + trace.activeTrace.status;
        this.component.detect();
      });
    this.store.select(selectTracingActiveTraceGroups)
      .pipe(untilDestroyed(this))
      .subscribe((groups: TracingTraceGroup[]) => {
        this.component.checkpoints = groups[0]?.checkpoints;
        if (this.component.allExpanded) {
          this.component.expandAll();
        }
        this.component.detect();
      });
  }

  closeSidePanel(): void {
    this.router.navigate([Routes.TRACING, Routes.BLOCKS], { queryParamsHandling: 'merge' });
    this.store.dispatch<TracingBlocksSelectRow>({ type: TRACING_BLOCKS_SELECT_ROW, payload: undefined });
  }
}
