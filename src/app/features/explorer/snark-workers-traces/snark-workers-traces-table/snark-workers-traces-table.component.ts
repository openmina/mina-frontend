import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectSWTracesActiveRow, selectSWTracesSort } from '@explorer/snark-workers-traces/snark-workers-traces.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SW_TRACES_SET_ACTIVE_JOB, SW_TRACES_SORT, SWTracesSetActiveJob, SWTracesSort } from '@explorer/snark-workers-traces/snark-workers-traces.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { take } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@UntilDestroy()
@Component({
  selector: 'mina-snark-workers-traces-table',
  templateUrl: './snark-workers-traces-table.component.html',
  styleUrls: ['./snark-workers-traces-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class SnarkWorkersTracesTableComponent extends ManualDetection implements OnChanges {

  readonly itemSize: number = 32;
  readonly config: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<SnarkWorkerTraceJob>[] = [
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
  workers: string[];
  activeRow: SnarkWorkerTraceJob;
  currentSort: TableSort<SnarkWorkerTraceJob>;
  idFromRoute: number;

  @ViewChild(CdkVirtualScrollViewport) private scrollViewport: CdkVirtualScrollViewport;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToSortingChanges();
    this.listenToActiveRowChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.jobs = this.data.jobs;
    this.workers = this.data.workers;
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
        this.activeRow = row;
        this.detect();
      });
  }

  private scrollToElement(): void {
    const topElements = Math.round(this.scrollViewport.elementRef.nativeElement.offsetHeight / 2 / this.itemSize) - 3;
    const jobIndex = this.jobs.findIndex(j => j.id === this.idFromRoute);
    this.idFromRoute = undefined;
    this.scrollViewport.scrollToIndex(jobIndex - topElements);
    this.store.dispatch<SWTracesSetActiveJob>({ type: SW_TRACES_SET_ACTIVE_JOB, payload: this.jobs[jobIndex] });
  }

  onRowClick(job: SnarkWorkerTraceJob): void {
    this.store.dispatch<SWTracesSetActiveJob>({ type: SW_TRACES_SET_ACTIVE_JOB, payload: job });
    this.router.navigate([Routes.EXPLORER, Routes.SNARK_TRACES, job.id], { queryParamsHandling: 'merge' });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<SWTracesSort>({
      type: SW_TRACES_SORT,
      payload: { sortBy: sortBy as keyof SnarkWorkerTraceJob, sortDirection },
    });
  }

  private listenToSortingChanges(): void {
    this.store.select(selectSWTracesSort)
      .pipe(untilDestroyed(this))
      .subscribe((sort: TableSort<SnarkWorkerTraceJob>) => {
        this.currentSort = sort;
        this.detect();
      });
  }
}
