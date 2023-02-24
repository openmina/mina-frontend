import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, take } from 'rxjs';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { SnarkWorkersTracesService } from './snark-workers-traces.service';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import { SW_TRACES_CLOSE, SW_TRACES_GET_JOBS, SWTracesClose, SWTracesGetJobs } from '@explorer/snark-workers-traces/snark-workers-traces.actions';
import { selectSWTracesActiveRow, selectSWTracesFilter, selectSWTracesSort } from '@explorer/snark-workers-traces/snark-workers-traces.state';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { SnarkWorkersTracesTableComponent } from '@explorer/snark-workers-traces/snark-workers-traces-table/snark-workers-traces-table.component';

@UntilDestroy()
@Component({
  selector: 'mina-snark-workers-traces',
  templateUrl: './snark-workers-traces.component.html',
  styleUrls: ['./snark-workers-traces.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class SnarkWorkersTracesComponent extends ManualDetection implements OnInit, OnDestroy {

  data: { jobs: SnarkWorkerTraceJob[], workers: string[] } = { jobs: [], workers: [] };
  sort: TableSort<SnarkWorkerTraceJob>;
  isActiveRow: boolean;
  removedClass: boolean;

  @ViewChild(SnarkWorkersTracesTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  constructor(private swTracesService: SnarkWorkersTracesService,
              private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToActiveRowChange();
    this.listenToRouteChange();
    this.listenToFiltersChanges();
    this.listenToSortingChanges();
    this.swTracesService.getWorkers().subscribe(workers => {
      this.data = { jobs: this.data.jobs, workers };
      this.detect();
    });
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectSWTracesActiveRow)
      .pipe(untilDestroyed(this))
      .subscribe((row: SnarkWorkerTraceJob) => {
        if (row && !this.isActiveRow) {
          this.isActiveRow = true;
          if (!this.removedClass) {
            this.removedClass = true;
            this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
          }
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
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe(filter => {
        this.swTracesService.getTraces(filter)
          .pipe(untilDestroyed(this))
          .subscribe((jobs: SnarkWorkerTraceJob[]) => {
            this.data = {
              ...this.data,
              jobs: this.sortJobs(jobs, this.sort),
            };
            this.detect();
          });
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

  sortJobs(jobs: SnarkWorkerTraceJob[], tableSort: TableSort<SnarkWorkerTraceJob>): SnarkWorkerTraceJob[] {
    return sort<SnarkWorkerTraceJob>(jobs, tableSort, ['ids', 'kind']);
  }

  ngOnDestroy(): void {
    this.store.dispatch<SWTracesClose>({ type: SW_TRACES_CLOSE });
  }
}
