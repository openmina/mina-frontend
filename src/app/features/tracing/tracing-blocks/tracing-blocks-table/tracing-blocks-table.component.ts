import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { Router } from '@angular/router';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { filter } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { selectTracingActiveTrace, selectTracingBlocksSorting, selectTracingTraces } from '@tracing/tracing-blocks/tracing-blocks.state';
import { TracingBlocksSelectRow, TracingBlocksSort } from '@tracing/tracing-blocks/tracing-blocks.actions';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { selectActiveNode } from '@app/app.state';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';

const secDurationConfig: SecDurationConfig = {
  severe: 50,
  warn: 30,
  default: 10,
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
export class TracingBlocksTableComponent extends MinaTableWrapper<TracingBlockTrace> implements OnInit {

  readonly secDurationConfig: SecDurationConfig = secDurationConfig;
  readonly origin: string = origin;

  activeNodeName: string;

  protected readonly tableHeads: TableColumnList<TracingBlockTrace> = [
    { name: 'height' },
    { name: 'global slot', sort: 'globalSlot' },
    { name: 'hash' },
    { name: 'creator' },
    { name: 'total time', sort: 'totalTime' },
    { name: 'source' },
    { name: 'status' },
  ];

  private traces: TracingBlockTrace[] = [];
  private activeTrace: TracingBlockTrace;
  private hashFromRoute: string;
  private preselect: boolean;

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToTracesChanges();
    this.listenToActiveTraceChange();
    this.listenToRouteChange();
    this.listenToActiveNodeChange();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [96, 96, 230, 'auto', 120, 120, 120];
    this.table.minWidth = 998;
    this.table.sortClz = TracingBlocksSort;
    this.table.sortSelector = selectTracingBlocksSorting;
    this.table.propertyForActiveCheck = 'hash';
  }

  private listenToActiveNodeChange(): void {
    this.select(selectActiveNode, (node: MinaNode) => {
      this.activeNodeName = node.name;
    }, filter(Boolean));
  }

  protected override onRowClick(trace: TracingBlockTrace): void {
    if (this.activeTrace?.hash !== trace.hash) {
      this.router.navigate([Routes.TRACING, Routes.BLOCKS, trace.hash], { queryParamsHandling: 'merge' });
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
      this.table.rows = traces;
      this.table.detect();
      if (this.preselect) {
        this.dispatch(TracingBlocksSelectRow, this.traces.find(t => t.hash === this.hashFromRoute));
        this.preselect = false;
        this.detect();
        this.scrollToElement();
        return;
      }
      this.detect();
    }, filter(Boolean));
  }

  private scrollToElement(): void {
    if (!this.hashFromRoute) {
      return;
    }
    this.table.scrollToElement(t => t.hash === this.hashFromRoute);
  }

  private listenToActiveTraceChange(): void {
    this.select(selectTracingActiveTrace, (activeTrace: TracingBlockTrace) => {
      this.activeTrace = activeTrace;
      this.table.activeRow = activeTrace;
      this.table.detect();
      this.detect();
    }, filter(trace => trace !== this.activeTrace));
  }
}
