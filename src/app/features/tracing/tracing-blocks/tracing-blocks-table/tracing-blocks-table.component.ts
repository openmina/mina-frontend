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
import { filter, Observable, tap } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { selectTracingActiveTrace, selectTracingBlocksSorting, selectTracingTraces } from '@tracing/tracing-blocks/tracing-blocks.state';
import { TRACING_BLOCKS_SELECT_ROW, TRACING_BLOCKS_SORT, TracingBlocksSelectRow, TracingBlocksSort } from '@tracing/tracing-blocks/tracing-blocks.actions';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';

const secDurationConfig: SecDurationConfig = {
  red: 50,
  orange: 30,
  yellow: 10,
  color: true,
  onlySeconds: true,
};

@UntilDestroy()
@Component({
  selector: 'mina-tracing-blocks-table',
  templateUrl: './tracing-blocks-table.component.html',
  styleUrls: ['./tracing-blocks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class TracingBlocksTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;
  readonly secDurationConfig: SecDurationConfig = secDurationConfig;
  readonly tableHeads: TableHeadSorting[] = [
    { name: 'height' },
    { name: 'hash' },
    { name: 'total time', sort: 'totalTime' },
    { name: 'source' },
    { name: 'status' },
  ];

  traces: TracingBlockTrace[] = [];
  activeTrace: TracingBlockTrace;
  currentSort$: Observable<TableSort>;

  @ViewChild(CdkVirtualScrollViewport) private scrollViewport: CdkVirtualScrollViewport;
  private hashFromRoute: string;
  private preselect: boolean;
  private currentSort: TableSort;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToTracesChanges();
    this.listenToSortingChanges();
    this.listenToActiveTraceChange();
    this.listenToRouteChange();
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<TracingBlocksSort>({
      type: TRACING_BLOCKS_SORT,
      payload: { sortBy, sortDirection },
    });
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
      .pipe(
        untilDestroyed(this),
        filter(traces => !!traces.length),
      )
      .subscribe((traces: TracingBlockTrace[]) => {
        this.traces = traces;
        if (this.preselect) {
          this.store.dispatch<TracingBlocksSelectRow>({
            type: TRACING_BLOCKS_SELECT_ROW,
            payload: this.traces.find(t => t.hash === this.hashFromRoute),
          });
          this.preselect = false;
          this.detect();
          this.scrollToElement();
          return;
        } else {
          this.scrollViewport.scrollTo({ top: 0 });
        }
        this.detect();
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

  private listenToSortingChanges(): void {
    this.currentSort$ = this.store.select(selectTracingBlocksSorting)
      .pipe(tap(sort => this.currentSort = sort));
  }
}
