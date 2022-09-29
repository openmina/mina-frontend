import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { filter } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { selectTracingActiveTrace, selectTracingTraces } from '@tracing/tracing-blocks/tracing-blocks.state';
import { TRACING_BLOCKS_SELECT_ROW, TracingBlocksSelectRow } from '@tracing/tracing-blocks/tracing-blocks.actions';

@UntilDestroy()
@Component({
  selector: 'mina-tracing-blocks-table',
  templateUrl: './tracing-blocks-table.component.html',
  styleUrls: ['./tracing-blocks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class TracingBlocksTableComponent extends ManualDetection implements OnInit {

  traces: TracingBlockTrace[];
  itemSize: number = 36;
  activeTrace: TracingBlockTrace;

  @ViewChild(CdkVirtualScrollViewport) private scrollViewport: CdkVirtualScrollViewport;
  private hashFromRoute: string;
  private preselect: boolean;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToTracesChanges();
    this.listenToActiveTraceChange();
    this.listenToRouteChange();
  }

  onRowClick(trace: TracingBlockTrace): void {
    if (this.activeTrace?.hash !== trace.hash) {
      this.router.navigate([Routes.TRACING, Routes.BLOCKS, trace.hash]);
      this.activeTrace = trace;
      this.store.dispatch<TracingBlocksSelectRow>({ type: TRACING_BLOCKS_SELECT_ROW, payload: trace });
    }
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this))
      .subscribe((route: MergedRoute) => {
        if (route.params['hash'] && this.traces.length === 0) {
          this.hashFromRoute = route.params['hash'];
          this.preselect = true;
        }
      });
  }

  private listenToTracesChanges(): void {
    this.store.select(selectTracingTraces)
      .pipe(untilDestroyed(this))
      .subscribe((traces: TracingBlockTrace[]) => {
        this.traces = traces;
        if (this.preselect) {
          this.store.dispatch<TracingBlocksSelectRow>({
            type: TRACING_BLOCKS_SELECT_ROW,
            payload: this.traces.find(t => t.hash === this.hashFromRoute),
          });
        }
        this.detect();
        this.scrollToElement();
      });
  }

  private scrollToElement(): void {
    if (!this.hashFromRoute) {
      return;
    }
    const topElements = Math.floor(this.scrollViewport.elementRef.nativeElement.offsetHeight / 2 / this.itemSize);
    const index = this.traces.findIndex(t => t.hash === this.hashFromRoute) - topElements;
    this.scrollViewport.scrollToIndex(index);
  }

  private listenToActiveTraceChange(): void {
    this.store.select(selectTracingActiveTrace)
      .pipe(
        untilDestroyed(this),
        filter(trace => trace !== this.activeTrace),
      )
      .subscribe((activeTrace: TracingBlockTrace) => {
        this.activeTrace = activeTrace;
        this.detect();
      });
  }
}
