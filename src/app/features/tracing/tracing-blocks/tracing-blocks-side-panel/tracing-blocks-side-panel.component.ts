import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { TracingTraceCheckpoint } from '@shared/types/tracing/blocks/tracing-trace-checkpoint.type';
import { selectTracingActiveTraceDetails, selectTracingActiveTraceGroups } from '@tracing/tracing-blocks/tracing-blocks.state';
import { TRACING_BLOCKS_SELECT_ROW, TracingBlocksSelectRow } from '@tracing/tracing-blocks/tracing-blocks.actions';

@UntilDestroy()
@Component({
  selector: 'mina-tracing-blocks-side-panel',
  templateUrl: './tracing-blocks-side-panel.component.html',
  styleUrls: ['./tracing-blocks-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column border-left' },
})
export class TracingBlocksSidePanelComponent extends ManualDetection implements OnInit {

  activeTrace: TracingBlockTrace;
  groups: TracingTraceGroup[];
  checkpoints: TracingTraceCheckpoint[];
  expandedParents: string[] = [];
  allExpanded: boolean;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToActiveTraceChange();
  }

  private listenToActiveTraceChange(): void {
    this.store.select(selectTracingActiveTraceDetails)
      .pipe(
        untilDestroyed(this),
        filter(t => !!t.activeTrace),
      )
      .subscribe((trace: { activeTrace: TracingBlockTrace; activeTraceGroups: TracingTraceGroup[] }) => {
        this.activeTrace = trace.activeTrace;
        if (trace.activeTraceGroups !== this.groups) {
          this.groups = trace.activeTraceGroups;
          this.detect();
        }
      });
    this.store.select(selectTracingActiveTraceGroups)
      .pipe(untilDestroyed(this))
      .subscribe((groups: TracingTraceGroup[]) => {
        // this.groups = groups;
        // TODO: add here the groups. Right now we have only checkpoints because there is only one group
        this.checkpoints = groups[0]?.checkpoints;
        if (this.allExpanded) {
          this.expandAll();
        }
        this.detect();
      });
  }

  closeSidePanel(): void {
    this.router.navigate([Routes.TRACING, Routes.BLOCKS], { queryParamsHandling: 'merge' });
    this.store.dispatch<TracingBlocksSelectRow>({ type: TRACING_BLOCKS_SELECT_ROW, payload: undefined });
  }

  toggleExpanding(checkpoint: TracingTraceGroup | TracingTraceCheckpoint): void {
    if (!checkpoint.checkpoints.length) {
      return;
    }
    const index = this.expandedParents.indexOf(checkpoint.title);
    if (index !== -1) {
      this.expandedParents.splice(index, 1);
    } else {
      this.expandedParents.push(checkpoint.title);
    }
  }

  expandAll(): void {
    this.allExpanded = true;
    this.collapseAll();
    const expandRecursively = (checkpoints: TracingTraceCheckpoint[]) => {
      checkpoints.forEach((checkpoint: TracingTraceCheckpoint) => {
        if (checkpoint.checkpoints.length) {
          this.expandedParents.push(checkpoint.title);
        }
        expandRecursively(checkpoint.checkpoints);
      });
    };
    expandRecursively(this.checkpoints);
  }

  collapseAll(): void {
    this.expandedParents = [];
    this.allExpanded = false;
  }
}
