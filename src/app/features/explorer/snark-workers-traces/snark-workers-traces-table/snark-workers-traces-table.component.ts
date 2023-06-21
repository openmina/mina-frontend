import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { selectSWTracesActiveRow, selectSWTracesSort } from '@explorer/snark-workers-traces/snark-workers-traces.state';
import { SWTracesSetActiveJob, SWTracesSort } from '@explorer/snark-workers-traces/snark-workers-traces.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { take } from 'rxjs';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';

@Component({
  selector: 'mina-snark-workers-traces-table',
  templateUrl: './snark-workers-traces-table.component.html',
  styleUrls: ['./snark-workers-traces-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class SnarkWorkersTracesTableComponent extends MinaTableWrapper<SnarkWorkerTraceJob> implements OnChanges {

  readonly config: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  protected readonly tableHeads: TableColumnList<SnarkWorkerTraceJob> = [
    { name: 'worker' },
    { name: 'work IDs', sort: 'ids' },
    { name: 'kind' },
    { name: 'job init', sort: 'jobInit' },
    { name: 'job received', sort: 'jobReceived' },
    { name: 'proof generated', sort: 'proofGenerated' },
    { name: 'proof submitted', sort: 'proofSubmitted' },
  ];

  @Input() data: { jobs: SnarkWorkerTraceJob[], workers: string[] };

  jobs: SnarkWorkerTraceJob[];
  idFromRoute: number;

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToRouteChange();
    this.listenToActiveRowChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.jobs = this.data.jobs;
    if (this.table) {
      this.table.rows = this.jobs;
      this.table.detect();
    }
    if (this.idFromRoute && this.jobs.length) {
      this.detect();
      this.scrollToElement();
    }
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [135, 175, 175, 175, 175, 180, 140];
    this.table.sortClz = SWTracesSort;
    this.table.sortSelector = selectSWTracesSort;
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['id'] && this.jobs.length === 0) {
        this.idFromRoute = Number(route.params['id']);
      }
    }, take(1));
  }

  private listenToActiveRowChange(): void {
    this.select(selectSWTracesActiveRow, (row: SnarkWorkerTraceJob) => {
      this.table.activeRow = row;
      this.table.detect();
      this.detect();
    });
  }

  private scrollToElement(): void {
    const jobFinder = (job: SnarkWorkerTraceJob) => job.id === this.idFromRoute;
    const jobIndex = this.jobs.findIndex(jobFinder);
    this.table.scrollToElement(jobFinder);
    this.idFromRoute = undefined;
    this.dispatch(SWTracesSetActiveJob, this.jobs[jobIndex]);
  }

  protected override onRowClick(job: SnarkWorkerTraceJob): void {
    this.dispatch(SWTracesSetActiveJob, job);
    this.router.navigate([Routes.EXPLORER, Routes.SNARK_TRACES, job.id], { queryParamsHandling: 'merge' });
  }
}
