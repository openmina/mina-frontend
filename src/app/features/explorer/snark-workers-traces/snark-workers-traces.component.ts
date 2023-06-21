import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from '@ngneat/until-destroy';
import { catchError, debounceTime, EMPTY, filter, switchMap, take, tap } from 'rxjs';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { SnarkWorkersTracesService } from './snark-workers-traces.service';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import {
  SW_TRACES_GET_JOBS,
  SW_TRACES_INIT,
  SWTracesClose,
  SWTracesGetJobs,
  SWTracesGetTraces,
  SWTracesGetTracesSuccess,
  SWTracesInit,
} from '@explorer/snark-workers-traces/snark-workers-traces.actions';
import {
  selectSWTracesActiveRow,
  selectSWTracesFilter,
  selectSWTracesSort,
  selectSWTracesWorkers,
} from '@explorer/snark-workers-traces/snark-workers-traces.state';
import { SnarkWorkerTraceFilter } from '@shared/types/explorer/snark-traces/snark-worker-trace-filters.type';
import { selectActiveNode } from '@app/app.state';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-snark-workers-traces',
  templateUrl: './snark-workers-traces.component.html',
  styleUrls: ['./snark-workers-traces.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class SnarkWorkersTracesComponent extends StoreDispatcher implements OnInit, OnDestroy {

  data: { jobs: SnarkWorkerTraceJob[], workers: string[] } = { jobs: [], workers: [] };
  sort: TableSort<SnarkWorkerTraceJob>;
  isActiveRow: boolean;

  private destroyComponent: boolean;

  constructor(private swTracesService: SnarkWorkersTracesService,
              public el: ElementRef<HTMLElement>) { super(); }

  ngOnInit(): void {
    this.listenToActiveNodeChange();
    this.listenToActiveRowChange();
    this.listenToRouteChange();
    this.listenToFiltersChanges();
    this.listenToSortingChanges();
    this.listenToSWTracesWorkersChange();
  }

  private listenToActiveNodeChange(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe(() => {
        this.store.dispatch<SWTracesInit>({ type: SW_TRACES_INIT });
      });
  }

  private listenToSWTracesWorkersChange(): void {
    this.store.select(selectSWTracesWorkers)
      .pipe(untilDestroyed(this))
      .subscribe((workers: string[]) => {
        this.data = { jobs: this.data.jobs, workers };
        this.detect();
      });
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectSWTracesActiveRow)
      .pipe(untilDestroyed(this))
      .subscribe((row: SnarkWorkerTraceJob) => {
        if (row && !this.isActiveRow) {
          this.isActiveRow = true;
          this.detect();
        } else if (!row && this.isActiveRow) {
          this.isActiveRow = false;
          this.detect();
        }
      });
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(
        untilDestroyed(this),
        take(1),
      )
      .subscribe((route: MergedRoute) => {
        if (route.queryParams['workers'] || route.queryParams['from'] || route.queryParams['to']) {
          const workers = route.queryParams['workers'];
          const from = Number(route.queryParams['from']);
          const to = Number(route.queryParams['to']);
          this.store.dispatch<SWTracesGetJobs>({
            type: SW_TRACES_GET_JOBS,
            payload: {
              workers: workers?.split(',') || [],
              from: !isNaN(from) ? from : undefined,
              to: !isNaN(to) ? to : undefined,
            },
          });
        }
      });
  }

  private listenToFiltersChanges(): void {
    this.store.select(selectSWTracesFilter)
      .pipe(
        untilDestroyed(this),
        debounceTime(300),
        filter(() => !this.destroyComponent),
        tap(() => this.dispatch(SWTracesGetTraces)),
        switchMap((swFilter: SnarkWorkerTraceFilter) => this.swTracesService.getTraces(swFilter)),
        tap(() => this.dispatch(SWTracesGetTracesSuccess)),
        catchError(() => {
          this.dispatch(SWTracesGetTracesSuccess);
          return EMPTY;
        }),
      )
      .subscribe((jobs: SnarkWorkerTraceJob[]) => {
        this.data = {
          ...this.data,
          jobs: this.sortJobs(jobs, this.sort),
        };
        this.detect();
      });
  }

  private listenToSortingChanges(): void {
    this.store.select(selectSWTracesSort)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.sort = sort;
        if (this.data.jobs.length) {
          this.data = {
            ...this.data,
            jobs: this.sortJobs(this.data.jobs, sort),
          };
          this.detect();
        }
      });
  }

  private sortJobs(jobs: SnarkWorkerTraceJob[], tableSort: TableSort<SnarkWorkerTraceJob>): SnarkWorkerTraceJob[] {
    return sort<SnarkWorkerTraceJob>(jobs, tableSort, ['worker', 'kind']);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroyComponent = true;
    this.dispatch(SWTracesClose);
  }
}
