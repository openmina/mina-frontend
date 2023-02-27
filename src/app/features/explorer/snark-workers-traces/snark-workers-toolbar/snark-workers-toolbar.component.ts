import { ChangeDetectionStrategy, Component, ComponentRef, ElementRef, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectSWTracesFilter } from '@explorer/snark-workers-traces/snark-workers-traces.state';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { SW_TRACES_GET_JOBS, SWTracesGetJobs } from '@explorer/snark-workers-traces/snark-workers-traces.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { IntervalSelectComponent } from '@shared/components/interval-select/interval-select.component';
import { TimestampInterval } from '@shared/types/shared/timestamp-interval.type';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';
import { SnarkWorkerTraceJob } from '@app/shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import { SnarkWorkerTraceFilter } from '@shared/types/explorer/snark-traces/snark-worker-trace-filters.type';
import { toggleItem } from '@shared/helpers/array.helper';

@UntilDestroy()
@Component({
  selector: 'mina-snark-workers-toolbar',
  templateUrl: './snark-workers-toolbar.component.html',
  styleUrls: ['./snark-workers-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-bottom h-xl flex-row align-center pl-12 flex-between' },
  providers: [DatePipe],
})
export class SnarkWorkersToolbarComponent extends ManualDetection implements OnInit {

  @Input() data: { jobs: SnarkWorkerTraceJob[], workers: string[] };
  filter: SnarkWorkerTraceFilter;
  activeInterval: string;

  @ViewChild('dropdown') private drTemplate: TemplateRef<void>;
  @ViewChild('dropdownTrigger') private dropdownTrigger: ElementRef<HTMLDivElement>;
  private workerSelectorOverlay: OverlayRef;
  private timePickerOverlay: OverlayRef;
  private intervalSelectComponent: ComponentRef<IntervalSelectComponent>;
  private currentTimestamp: TimestampInterval;

  constructor(private router: Router,
              private datePipe: DatePipe,
              private overlay: Overlay,
              private store: Store<MinaState>,
              private viewContainerRef: ViewContainerRef) { super(); }

  ngOnInit(): void {
    this.listenToFiltersChanges();
  }

  private listenToFiltersChanges(): void {
    this.store.select(selectSWTracesFilter)
      .pipe(untilDestroyed(this))
      .subscribe(filter => {
        this.filter = filter;
        if (this.currentTimestamp?.from !== filter.from || this.currentTimestamp?.to !== filter.to) {
          this.buildActiveIntervalText(filter.from, filter.to);
        }
        this.currentTimestamp = { from: filter.from, to: filter.to };
        this.navigateToTimestamp(this.currentTimestamp);
        this.detect();
      });
  }

  private buildActiveIntervalText(fromParam: number, toParam: number): void {
    let from;
    if (fromParam) {
      from = this.datePipe.transform(fromParam, 'MMM d, H:mm:ss');
    }
    let to;
    if (toParam) {
      to = this.datePipe.transform(toParam, 'MMM d, H:mm:ss');
    }
    if (from && to) {
      if (from.split(',')[0] === to.split(',')[0]) {
        to = this.datePipe.transform(toParam, 'H:mm:ss');
      }
      this.activeInterval = from + ' - ' + to;
    } else if (from && !to) {
      this.activeInterval = 'From ' + from;
    } else if (to && !from) {
      this.activeInterval = 'Until ' + to;
    } else {
      this.activeInterval = this.currentTimestamp = undefined;
    }
  }

  toggleWorker(worker: string): void {
    const workers = toggleItem(this.filter.workers, worker);
    this.addWorkersToStore(workers);
    this.addWorkersToRoute(workers.length !== 0 ? workers.join(',') : undefined);
  }

  getAllWorkers(): void {
    this.addWorkersToStore([]);
    this.addWorkersToRoute(undefined);
  }

  private addWorkersToStore(workers: string[]): void {
    this.store.dispatch<SWTracesGetJobs>({ type: SW_TRACES_GET_JOBS, payload: { ...this.filter, workers } });
  }

  private addWorkersToRoute(workers: string | undefined): void {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: { workers },
    });
  }

  openDropdown(event: MouseEvent): void {
    if (this.workerSelectorOverlay?.hasAttached()) {
      this.workerSelectorOverlay.detach();
      return;
    }

    this.workerSelectorOverlay = this.overlay.create({
      hasBackdrop: false,
      width: 650,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.dropdownTrigger.nativeElement)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 35,
        }]),
    });
    event.stopPropagation();

    const portal = new TemplatePortal(this.drTemplate, this.viewContainerRef);
    this.workerSelectorOverlay.attach(portal);
  }

  detachWorkerSelector(): void {
    if (this.workerSelectorOverlay?.hasAttached()) {
      this.workerSelectorOverlay.detach();
    }
  }

  openIntervalPicker(event?: MouseEvent): void {
    if (this.timePickerOverlay?.hasAttached()) {
      this.timePickerOverlay.detach();
      return;
    }

    this.timePickerOverlay = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(event?.target as HTMLElement)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 9,
          offsetX: -10,
        }]),
    });
    event?.stopPropagation();

    const portal = new ComponentPortal(IntervalSelectComponent);
    this.intervalSelectComponent = this.timePickerOverlay.attach<IntervalSelectComponent>(portal);
    this.intervalSelectComponent.instance.from = this.currentTimestamp?.from;
    this.intervalSelectComponent.instance.to = this.currentTimestamp?.to;
    this.intervalSelectComponent.instance.skipFrom = true;
    this.intervalSelectComponent.instance.skipTo = true;
    setTimeout(() => {
      this.intervalSelectComponent.instance.animate = true;
      this.intervalSelectComponent.instance.detect();
    });
    this.intervalSelectComponent.instance.onConfirm
      .pipe(take(1))
      .subscribe((response: TimestampInterval) => {
        this.intervalSelectComponent.instance.animate = false;
        this.intervalSelectComponent.instance.detect();
        if (response && (this.currentTimestamp?.from !== response.from || this.currentTimestamp?.to !== response.to)) {
          this.navigateToTimestamp(response);
          this.store.dispatch<SWTracesGetJobs>({
            type: SW_TRACES_GET_JOBS,
            payload: {
              ...this.filter,
              from: response.from,
              to: response.to,
            },
          });
        }
        setTimeout(() => this.detachTimePicker(), 250);
      });
  }

  private navigateToTimestamp(interval: TimestampInterval): void {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: { from: interval.from, to: interval.to },
    });
  }

  private detachTimePicker(): void {
    if (this.timePickerOverlay?.hasAttached()) {
      this.timePickerOverlay.detach();
    }
  }

  clearTimestampInterval(event: MouseEvent): void {
    event.stopPropagation();
    this.activeInterval = this.currentTimestamp = undefined;
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        from: undefined, to: undefined,
      },
    });
    this.store.dispatch<SWTracesGetJobs>({
      type: SW_TRACES_GET_JOBS,
      payload: {
        ...this.filter,
        from: undefined,
        to: undefined,
      },
    });
    this.detachTimePicker();
  }
}
