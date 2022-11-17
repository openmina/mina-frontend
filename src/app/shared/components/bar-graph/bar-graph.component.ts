import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MIN_WIDTH_700 } from '@shared/constants/breakpoint-observer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { getXTicks } from '@shared/helpers/graph.helper';
import { BehaviorSubject, Observable } from 'rxjs';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

class ChartColumn {
  name: string;
  value: number;
  range: string;
  step: number;
}

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'mina-bar-graph',
  imports: [CommonModule, FlexLayoutModule],
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 mt-10 pt-12 flex-column' },
})
export class BarGraphComponent extends ManualDetection implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() values: number[] = [];
  @Input() xStep: number;
  @Input() yAxisValues: number[] = [];
  @Input() xTicksLength: number = 20;
  @Input() yTicksLength: number = 10;
  @Input() um: string;
  @Input() yAxisLabel: string;
  @Input() decimals: number = 1;

  chartColumns: ChartColumn[];
  ticks: Observable<string[]>;
  maxHeight: number;

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<{ count: number, range: string }>;
  @ViewChild('columnContainer') private columnContainer: ElementRef<HTMLDivElement>;

  private bars: number[];
  private overlayRef: OverlayRef;
  private initialXTicksLength: number;
  private xTicksValues$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private internalXStep: number;

  constructor(private breakpointObserver: BreakpointObserver,
              private viewContainerRef: ViewContainerRef,
              private overlay: Overlay) { super(); }

  ngOnInit(): void {
    this.initialXTicksLength = this.xTicksLength;
    this.bars = this.getBars;
    this.chartColumns = this.initChartColumns();
    this.xTicksValues$.next(this.xTicks);
    this.ticks = this.xTicksValues$.asObservable();
    this.listenToResizeEvent();
    this.update();
  }

  ngAfterViewInit(): void {
    this.maxHeight = this.columnContainer.nativeElement.offsetHeight;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.bars && changes['values']?.currentValue !== changes['values']?.previousValue) {
      this.update();
    }
  }

  private initChartColumns(): ChartColumn[] {
    const map = new Map<number, { value: number, range: string }>();

    this.bars.forEach((curr: number, i: number) => {
      const value = {
        value: 0,
        range: i === this.bars.length - 1
          ? `> ${curr.toFixed(this.decimals)}${this.um}`
          : `${curr.toFixed(this.decimals)}${this.um} - ${(curr + this.internalXStep).toFixed(this.decimals)}${this.um}`,
      };
      map.set(curr, value);
    });

    const chartColumns = [];
    for (const [key, value] of map.entries()) {
      chartColumns.push({
        name: Number(key).toFixed(this.decimals) + this.um,
        value: value.value,
        range: value.range,
        step: Number(Number(key).toFixed(this.decimals)),
      } as ChartColumn);
    }
    return chartColumns;
  }

  public update(): void {
    this.chartColumns.forEach(col => col.value = 0);
    this.values.forEach(time => {
      const column = this.findClosestSmallerStep(time);
      column.value++;
    });
    this.yAxisValues = this.yTicks;
    this.maxHeight = this.columnContainer?.nativeElement.offsetHeight;
  }

  private get xTicks(): string[] {
    return getXTicks(this.chartColumns, Math.min(this.chartColumns.length, this.xTicksLength), 'name');
  }

  private get getBars(): number[] {
      this.internalXStep = this.xStep;
      const res = [0];
      let i = this.xStep;
      while (i <= this.xTicksLength * this.xStep) {
        res.push(i);
        i = i + this.xStep;
      }
      return res;
    //get steps and ticks automatically
    // const [xStep, yMaxTick] = niceYScale(0, 30, this.xTicksLength);
    // this.internalXStep = xStep;
    // const xTicks = [];
    //
    // for (let i = 0; i <= yMaxTick; i += xStep) {
    //   xTicks.push(i);
    // }
    // return xTicks;
  }

  private findClosestSmallerStep(value: number): ChartColumn {
    let closest = null;
    for (const item of this.chartColumns) {
      if (item.step <= value) {
        closest = item;
      } else {
        return closest;
      }
    }
    return closest;
  }

  private listenToResizeEvent(): void {
    this.breakpointObserver
      .observe(MIN_WIDTH_700)
      .pipe(untilDestroyed(this))
      .subscribe((value: BreakpointState) => {
        if (value.breakpoints[MIN_WIDTH_700]) {
          this.xTicksLength = this.initialXTicksLength;
        } else {
          this.xTicksLength = 6;
        }
        this.xTicksValues$.next(this.xTicks);
      });
  }

  openDetailsOverlay(column: ChartColumn, event: MouseEvent): void {
    this.detachOverlay();

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([{
          originX: 'center',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 10,
        }]),
    });

    event.stopPropagation();
    const context = this.tooltipTemplate
      .createEmbeddedView({
        count: column.value,
        range: column.range,
      })
      .context;
    const portal = new TemplatePortal(this.tooltipTemplate, this.viewContainerRef, context);
    this.overlayRef.attach(portal);
  }

  detachOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  private get yTicks(): number[] {
    const numbers = this.chartColumns.map(c => c.value);
    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    const [ySpacing, yMaxTick] = niceYScale(min, max, this.yTicksLength);
    const yTicks = [];

    for (let i = Math.max(yMaxTick, this.yTicksLength); i >= 0; i -= Math.max(1, ySpacing)) {
      yTicks.push(i);
    }

    return yTicks;
  }

  ngOnDestroy(): void {
    this.detachOverlay();
  }
}

/**
 * Instantiates a new instance of the NiceScale class.
 *
 * Calculate and update values for tick spacing and nice
 * minimum and maximum data points on the axis.
 */
function niceYScale(min: number, max: number, maxTicks: number): [tickSpacing: number, niceMax: number, niceMin: number] {
  const minPoint = min;
  const maxPoint = max;
  const range = niceNum(maxPoint - minPoint, false);
  const tickSpacing = niceNum(range / (maxTicks - 1), true);
  const niceMin = Math.floor(minPoint / tickSpacing) * tickSpacing;
  const niceMax = Math.ceil(maxPoint / tickSpacing) * tickSpacing;
  return [tickSpacing, niceMax, niceMin];
}

/**
 * Returns a "nice" number approximately equal to range Rounds
 * the number if round = true Takes the ceiling if round = false.
 *
 *  localRange the data range
 *  round whether to round the result
 *  a "nice" number to be used for the data range
 */
function niceNum(localRange: number, round: boolean): number {
  /** exponent of localRange */
  let exponent: number;
  /** fractional part of localRange */
  let fraction: number;
  /** nice, rounded fraction */
  let niceFraction: number;

  exponent = Math.floor(Math.log10(localRange));
  fraction = localRange / Math.pow(10, exponent);

  if (round) {
    if (fraction < 1.5)
      niceFraction = 1;
    else if (fraction < 3)
      niceFraction = 2;
    else if (fraction < 7)
      niceFraction = 5;
    else
      niceFraction = 10;
  } else {
    if (fraction <= 1)
      niceFraction = 1;
    else if (fraction <= 2)
      niceFraction = 2;
    else if (fraction <= 5)
      niceFraction = 5;
    else
      niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
}
