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

class ChartColumn {
  name: string;
  value: number;
  range: string;
  step: number;
}

@UntilDestroy()
@Component({
  selector: 'mina-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 p-12' },
})
export class BarGraphComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() times: number[];
  @Input() columnStep: number = 1;
  @Input() yAxisValues: number[] = [];
  @Input() xTicksValuesLength: number = 20;

  chartColumns: ChartColumn[];
  xTicksValues: string[];
  maxHeight: number;

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<{ count: number, range: string }>;
  @ViewChild('columnContainer') private columnContainer: ElementRef<HTMLDivElement>;

  private steps: number[];
  private overlayRef: OverlayRef;
  private initialXTicksValuesLength: number;

  constructor(private breakpointObserver: BreakpointObserver,
              private viewContainerRef: ViewContainerRef,
              private overlay: Overlay) { }

  ngOnInit(): void {
    this.initialXTicksValuesLength = this.xTicksValuesLength;
    this.steps = this.xSteps;
    this.chartColumns = this.initChartColumns();
    this.xTicksValues = this.getXTicks();
    this.listenToResizeEvent();
    this.update();
  }

  ngAfterViewInit(): void {
    this.maxHeight = this.columnContainer.nativeElement.offsetHeight;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.steps && changes['times']?.currentValue !== changes['times']?.previousValue) {
      this.update();
      this.yAxisValues = this.getYTicks();
    }
  }

  private initChartColumns(): ChartColumn[] {
    const seriesObj: { [p: number]: { value: number, range: string } } = this.steps.reduce((acc, curr: number, i: number) => ({
      ...acc,
      [curr]: {
        value: 0,
        range: i === this.steps.length - 1
          ? `> ${this.columnStep * 5}s`
          : `${curr}s - ${(curr + this.columnStep)}s`,
      },
    }), {});

    return Object.keys(seriesObj).map((key: string) => ({
      name: Number(key) + 's',
      value: seriesObj[key].value,
      range: seriesObj[key].range,
      step: Number(key),
    } as ChartColumn));
  }

  private update(): void {
    this.chartColumns.forEach(col => col.value = 0);
    this.times?.forEach(time => {
      const column = this.findClosestSmallerStep(time);
      column.value++;
    });
  }

  private getXTicks(): string[] {
    return getXTicks(this.chartColumns, Math.min(this.chartColumns.length, this.xTicksValuesLength), 'name');
  }

  private get xSteps(): number[] {
    const res = [0];
    let i = this.columnStep;
    while (i <= this.xTicksValuesLength * this.columnStep) {
      res.push(i);
      i = i + this.columnStep;
    }
    return res;
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
          this.xTicksValuesLength = this.initialXTicksValuesLength;
        } else {
          this.xTicksValuesLength = 6;
        }
        this.xTicksValues = this.getXTicks();
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

  ngOnDestroy(): void {
    this.detachOverlay();
  }

  private getYTicks(): number[] {
    const numbers = this.chartColumns.map(c => c.value);
    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    setMinMaxPoints(min, max);
    const x = niceScale(min, max);
    const tickSpacing = x.tickSpacing;
    const yTicks = [];

    for (let i = 0; i <= x.niceMaximum; i += tickSpacing) {
      yTicks.push(i);
    }

    return yTicks.reverse();
  }
}

var minPoint: any;
var maxPoint: any;
var maxTicks = 10;
var tickSpacing: any;
var range: any;
var niceMin: any;
var niceMax: any;

/**
 * Instantiates a new instance of the NiceScale class.
 *
 *  min the minimum data point on the axis
 *  max the maximum data point on the axis
 */
function niceScale(min: any, max: any) {
  minPoint = min;
  maxPoint = max;
  calculate();
  return {
    tickSpacing: tickSpacing,
    niceMinimum: niceMin,
    niceMaximum: niceMax,
  };
}


/**
 * Calculate and update values for tick spacing and nice
 * minimum and maximum data points on the axis.
 */
function calculate() {
  range = niceNum(maxPoint - minPoint, false);
  tickSpacing = niceNum(range / (maxTicks - 1), true);
  niceMin =
    Math.floor(minPoint / tickSpacing) * tickSpacing;
  niceMax =
    Math.ceil(maxPoint / tickSpacing) * tickSpacing;
}

/**
 * Returns a "nice" number approximately equal to range Rounds
 * the number if round = true Takes the ceiling if round = false.
 *
 *  localRange the data range
 *  round whether to round the result
 *  a "nice" number to be used for the data range
 */
function niceNum(localRange: any, round: any) {
  var exponent;
  /** exponent of localRange */
  var fraction;
  /** fractional part of localRange */
  var niceFraction; /** nice, rounded fraction */

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

/**
 * Sets the minimum and maximum data points for the axis.
 *
 *  minPoint the minimum data point on the axis
 *  maxPoint the maximum data point on the axis
 */
function setMinMaxPoints(localMinPoint: any, localMaxPoint: any) {
  minPoint = localMinPoint;
  maxPoint = localMaxPoint;
  calculate();
}

/**
 * Sets maximum number of tick marks we're comfortable with
 *
 *  maxTicks the maximum number of tick marks for the axis
 */
function setMaxTicks(localMaxTicks: any) {
  maxTicks = localMaxTicks;
  calculate();
}
