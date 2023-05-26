import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectSWTracesActiveRow, selectSWTracesSort } from '@explorer/snark-workers-traces/snark-workers-traces.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SW_TRACES_SET_ACTIVE_JOB, SWTracesSetActiveJob, SWTracesSort } from '@explorer/snark-workers-traces/snark-workers-traces.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { take } from 'rxjs';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';

@UntilDestroy()
@Component({
  selector: 'mina-snark-workers-traces-table',
  templateUrl: './snark-workers-traces-table.component.html',
  styleUrls: ['./snark-workers-traces-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class SnarkWorkersTracesTableComponent extends ManualDetection implements OnChanges {

  readonly config: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  private readonly tableHeads: TableColumnList<SnarkWorkerTraceJob> = [
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

  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<SnarkWorkerTraceJob>;
  @ViewChild('minaTable', { read: ViewContainerRef }) private containerRef: ViewContainerRef;

  private table: MinaTableComponent<SnarkWorkerTraceJob>;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<SnarkWorkerTraceJob>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = this.rowTemplate;
      this.table.gridTemplateColumns = [135, 175, 175, 175, 175, 180, 140];
      this.table.sortClz = SWTracesSort;
      this.table.sortSelector = selectSWTracesSort;
      this.table.rowClickEmitter.pipe(untilDestroyed(this)).subscribe((job: SnarkWorkerTraceJob) => this.onRowClick(job));
      this.table.init();
    });
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

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this), take(1))
      .subscribe((route: MergedRoute) => {
        if (route.params['id'] && this.jobs.length === 0) {
          this.idFromRoute = Number(route.params['id']);
        }
      });
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectSWTracesActiveRow)
      .pipe(untilDestroyed(this))
      .subscribe((row: SnarkWorkerTraceJob) => {
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
    this.store.dispatch<SWTracesSetActiveJob>({ type: SW_TRACES_SET_ACTIVE_JOB, payload: this.jobs[jobIndex] });
  }

  onRowClick(job: SnarkWorkerTraceJob): void {
    this.store.dispatch<SWTracesSetActiveJob>({ type: SW_TRACES_SET_ACTIVE_JOB, payload: job });
    this.router.navigate([Routes.EXPLORER, Routes.SNARK_TRACES, job.id], { queryParamsHandling: 'merge' });
  }
}
