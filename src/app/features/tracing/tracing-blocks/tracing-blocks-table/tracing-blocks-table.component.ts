import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { Router } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { filter } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { selectTracingActiveTrace, selectTracingBlocksSorting, selectTracingTraces } from '@tracing/tracing-blocks/tracing-blocks.state';
import { TracingBlocksSelectRow, TracingBlocksSort } from '@tracing/tracing-blocks/tracing-blocks.actions';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectActiveNode } from '@app/app.state';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';

const secDurationConfig: SecDurationConfig = {
  red: 50,
  orange: 30,
  yellow: 10,
  color: true,
  onlySeconds: true,
};

@Component({
  selector: 'mina-tracing-blocks-table',
  templateUrl: './tracing-blocks-table.component.html',
  styleUrls: ['./tracing-blocks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class TracingBlocksTableComponent extends StoreDispatcher implements OnInit {

  readonly itemSize: number = 36;
  readonly secDurationConfig: SecDurationConfig = secDurationConfig;
  readonly tableHeads: TableHeadSorting<TracingBlockTrace>[] = [
    { name: 'height' },
    { name: 'global slot', sort: 'globalSlot' },
    { name: 'hash' },
    { name: 'creator' },
    { name: 'total time', sort: 'totalTime' },
    { name: 'source' },
    { name: 'status' },
  ];
  readonly origin: string = origin;

  traces: TracingBlockTrace[] = [];
  activeTrace: TracingBlockTrace;
  currentSort: TableSort<TracingBlockTrace>;
  activeNodeName: string;

  @ViewChild(CdkVirtualScrollViewport) private scrollViewport: CdkVirtualScrollViewport;
  private hashFromRoute: string;
  private preselect: boolean;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToTracesChanges();
    this.listenToSortingChanges();
    this.listenToActiveTraceChange();
    this.listenToRouteChange();
    this.listenToActiveNodeChange();
  }

  private listenToActiveNodeChange(): void {
    this.select(selectActiveNode, (node: MinaNode) => {
      this.activeNodeName = node.name;
    }, filter(Boolean));
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(TracingBlocksSort, { sortBy: sortBy as keyof TracingBlockTrace, sortDirection });
  }

  onRowClick(trace: TracingBlockTrace): void {
    if (this.activeTrace?.hash !== trace.hash) {
      this.router.navigate([Routes.TRACING, Routes.BLOCKS, trace.hash], { queryParamsHandling: 'merge' });
      this.activeTrace = trace;
      this.dispatch(TracingBlocksSelectRow, trace);
    }
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['hash'] && this.traces.length === 0) {
        this.hashFromRoute = route.params['hash'];
        this.preselect = true;
      }
    });
  }

  private listenToTracesChanges(): void {
    this.select(selectTracingTraces, (traces: TracingBlockTrace[]) => {
      this.traces = traces;
      if (this.preselect) {
        this.dispatch(TracingBlocksSelectRow, this.traces.find(t => t.hash === this.hashFromRoute));
        this.preselect = false;
        this.detect();
        this.scrollToElement();
        return;
      } else {
        this.scrollViewport.scrollTo({ top: 0 });
      }
      this.detect();
    }, filter(Boolean));
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
    this.select(selectTracingActiveTrace, (activeTrace: TracingBlockTrace) => {
      this.activeTrace = activeTrace;
      this.detect();
    }, filter(trace => trace !== this.activeTrace));
  }

  private listenToSortingChanges(): void {
    this.select(selectTracingBlocksSorting, (sort: TableSort<TracingBlockTrace>) => {
      this.currentSort = sort;
      this.detect();
    });
  }

  seeBlockInNetwork(height: number): void {

  }
}
