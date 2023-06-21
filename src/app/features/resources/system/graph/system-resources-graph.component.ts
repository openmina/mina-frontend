import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { AxisDomain, curveLinear } from 'd3';
import { DatePipe, DecimalPipe } from '@angular/common';
import { SystemResourcesSetActivePoint } from '@resources/system/system-resources.actions';
import { SystemResourcesActivePoint } from '@shared/types/resources/system/system-resources-active-point.type';
import { noMillisFormat, toReadableDate } from '@shared/helpers/date.helper';
import { Router } from '@angular/router';
import { SystemResourcesPoint } from '@shared/types/resources/system/system-resources-point.type';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MAX_WIDTH_700, MIN_WIDTH_1200, MIN_WIDTH_1600 } from '@shared/constants/breakpoint-observer';
import { debounceTime, delay, distinctUntilChanged, filter, fromEvent, skip } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { selectAppMenu } from '@app/app.state';
import { Routes } from '@shared/enums/routes.enum';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectSystemResourcesRedrawCharts } from '@resources/system/system-resources.state';
import { isMobile } from '@shared/helpers/values.helper';

@Component({
  selector: 'mina-system-resources-graph',
  templateUrl: './system-resources-graph.component.html',
  styleUrls: ['./system-resources-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, DecimalPipe],
})
export class SystemResourcesGraphComponent extends StoreDispatcher implements AfterViewInit, OnChanges {

  @Input() data: SystemResourcesPoint[];
  @Input() title: string;
  @Input() um: string;
  @Input() paths: string[];
  @Input() colors: string[];
  @Input() maxY: number;
  @Input() preselectValue: boolean;
  @Input() activePointTitle: string;
  @Input() yLabel: string;

  @ViewChild('chart') private chart: ElementRef<HTMLDivElement>;
  @ViewChild('tooltipLocation') private tooltipLocation: ElementRef<HTMLDivElement>;

  private margin = { top: 10, right: 30, bottom: 30, left: 60 };
  private width: number;
  private height: number = 120 - this.margin.top - this.margin.bottom;
  private svg: any;
  private mainG: any;

  private clickableRect: any;
  private xScale: any;
  private yScale: any;
  private xAxisElement: any;
  private yAxisElement: any;
  private xAxis: any;
  private yAxis: any;
  private xAxisTicks: number;
  private lines: any[] = [];

  private tooltip: any;
  private xAxisTooltipLine: any;
  private tooltipHeight: number;

  private clicker: any;
  private clickerTextRect: any;
  private clickerText: any;
  private clickerConfig = {
    width: 126,
    height: 24,
    rectTranslateX: 63,
    textTranslateX: 57,
    padding: 3,
  };
  private clickerLocationPercentage: number;

  constructor(private router: Router,
              private datePipe: DatePipe,
              private decimalPipe: DecimalPipe,
              private breakpointObserver: BreakpointObserver) { super(); }

  ngAfterViewInit(): void {
    this.initGraph();
    this.listenToWindowResizing();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && this.data.length > 0 && changes['data']?.previousValue !== changes['data']?.currentValue && this.preselectValue !== undefined) {
      this.updateGraph();
    }

    if (this.preselectValue) {
      setTimeout(() => {
        this.preselectValue = false;
        const timestamp = this.timestampFromRoute;
        const index = this.data.map(d => d.timestamp).indexOf(timestamp);
        const percentage = index * 100 / this.data.length;
        const x0 = percentage / 100 * this.width;
        this.showClicker(x0, timestamp);
        this.preselectValue = false;
      }, 1);
    }

    if (this.activePointTitle !== this.title) {
      this.clicker?.style('opacity', 0);
      this.clickerLocationPercentage = undefined;
    }

    if (this.paths) { // can I move it in afterviewinit?
      this.tooltipHeight = this.paths.length * 20 + 30;
    }
  }

  private initGraph(): void {
    this.width = this.chart.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.svg = this.createSVG();
    this.mainG = this.createMainG();
    this.clicker = this.createClicker();
    this.createClickerMarkers();
    this.addXAxis();
    this.addYAxis();
    this.addClickableRect();
  }

  private updateGraph(): void {
    this.redrawXAxis();
    this.redrawYAxis();
    this.addGridLines();
    this.drawPath();
    this.clicker.raise();
    this.clickableRect.raise();
    this.listenToClickOnRect();
  }

  private redrawXAxis(): void {
    this.xScale = d3.scaleLinear()
      .domain([0, this.data.length - 1])
      .domain(d3.extent<SystemResourcesPoint, number>(this.data, d => d.timestamp))
      .range([0, this.width]);
    this.xAxis = d3.axisBottom<number>(this.xScale)
      .tickSize(0)
      .ticks(this.xAxisTicks)
      .tickFormat((d: number) => this.datePipe.transform(d, 'MM/dd, HH:mm'))
      .tickPadding(10);
    this.xAxisElement
      .call(this.xAxis);
  }

  private redrawYAxis(): void {
    this.yScale = d3.scaleLinear()
      .domain([0, d3.max([this.maxY])])
      .range([this.height, 0])
      .nice();
    this.yAxis = d3.axisLeft(this.yScale)
      .tickSize(0)
      .ticks(2.5)
      .tickFormat((d: AxisDomain) => `${d} ${this.um}`)
      .tickPadding(10);
    this.yAxisElement
      .call(this.yAxis);
  }

  private addGridLines(): void {
    d3.selectAll('g.tick line').remove();
    d3.selectAll('g.yAxis g.tick')
      .append('line')
      .attr('class', 'gridline')
      .attr('stroke', 'var(--base-divider)')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', this.width)
      .attr('y2', 0);
    d3.selectAll('g.xAxis g.tick')
      .append('line')
      .attr('class', 'gridline')
      .attr('stroke', 'var(--base-divider)')
      .attr('x1', 0)
      .attr('y1', -this.height)
      .attr('x2', 0)
      .attr('y2', 0);
  }

  private listenToClickOnRect(): void {
    this.clickableRect
      .datum(this.data)
      .on('click', (evt: PointerEvent, points: SystemResourcesPoint[]) => {
        const mouseX = d3.pointer(evt)[0];
        const point = this.getPointFromMousePosition(evt, points);
        this.dispatch(SystemResourcesSetActivePoint, this.createActivePoint(point));
        this.showClicker(mouseX, point.timestamp);

        this.router.navigate([Routes.RESOURCES, Routes.SYSTEM], {
          queryParams: {
            timestamp: point.timestamp,
            resource: this.createResourceQueryParam,
          },
          queryParamsHandling: 'merge',
        });
      });
  }

  private get createResourceQueryParam(): string {
    if (this.title.includes('Network')) {
      return 'network-io';
    } else if (this.title.includes('Storage')) {
      return 'storage-io';
    }
    return this.title.toLowerCase();
  }

  private addClickableRect(): void {
    if (!this.clickableRect) {
      this.xAxisTooltipLine = this.mainG
        .append('g')
        .append('rect')
        .attr('stroke', 'var(--base-primary)')
        .attr('stroke-width', '1px')
        .attr('width', '.5px')
        .attr('height', this.height)
        .style('opacity', 0);

      this.clickableRect = this.mainG
        .append('rect')
        .attr('fill', 'transparent')
        .attr('width', this.width)
        .attr('height', this.height)
        .on('mousemove', (evt: PointerEvent, points: SystemResourcesPoint[]) => this.onMouseMove(evt, points))
        .on('mouseleave', (evt: PointerEvent, points: SystemResourcesPoint[]) => this.onMouseMove(evt, points))
        .on('mouseleave', () => this.onMouseLeave());

      this.tooltip = d3.select(this.tooltipLocation.nativeElement);
    }
  }

  private onMouseLeave(): void {
    this.tooltip.style('display', 'none');
    this.xAxisTooltipLine.style('opacity', 0);
  }

  private onMouseMove(evt: PointerEvent, points: SystemResourcesPoint[]): void {
    if (!points || isMobile()) {
      return;
    }
    const point = this.getPointFromMousePosition(evt, points);

    this.tooltip.select('.date').text(toReadableDate(point.timestamp, noMillisFormat));
    this.tooltip.selectAll('.paths .value').nodes().forEach((bullet: HTMLDivElement, i: number) => {
      bullet.textContent = this.decimalPipe.transform(point.pathPoints[this.paths[i]].value, '1.2-2');
    });

    const tooltipWidth = 220;
    const maxRight = this.width + this.margin.left - tooltipWidth;
    const xPoint = this.xScale(point.timestamp);
    const mouseXMiddle = (xPoint + this.margin.left) - (tooltipWidth / 2);
    const x = Math.max(Math.min(mouseXMiddle, maxRight), this.margin.left);
    const rectY = this.clicker.node().getBoundingClientRect().bottom;
    const y = this.tooltipHeight + rectY > window.innerHeight - 100 ? -this.tooltipHeight : 160;

    this.tooltip.style('transform', `translate(${x}px,${y}px)`);
    this.tooltip.style('display', 'block');

    this.xAxisTooltipLine.attr('x', xPoint);
    this.xAxisTooltipLine.style('opacity', 1);
  }

  private getPointFromMousePosition(evt: PointerEvent, points: SystemResourcesPoint[]): SystemResourcesPoint {
    const mouseX = d3.pointer(evt)[0];
    const x0 = this.xScale.invert(mouseX);
    const i = d3.bisector((d: SystemResourcesPoint) => d.timestamp).left(points, x0, 1);
    const point0 = points[i - 1];
    const point1 = points[i];
    return x0 - point0.timestamp > point1.timestamp - x0 ? point1 : point0;
  }

  private addYAxis(): void {
    this.yScale = d3.scaleLinear()
      .domain([0, d3.max([0])])
      .range([this.height, 0])
      .nice();
    this.yAxisElement = this.mainG.append('g')
      .attr('class', 'yAxis inter tertiary f-base user-none');
    this.yAxis = d3.axisLeft(this.yScale)
      .tickSize(0)
      .tickFormat((d: AxisDomain) => `${d} ${this.um}`)
      .tickPadding(10);

    this.yAxisElement
      .call(this.yAxis)
      .select('.domain')
      .attr('stroke-width', 0);
    this.yAxisElement
      .append('text')
      .attr('x', -10)
      .attr('y', -15)
      .attr('fill', 'currentColor')
      .attr('transform', 'translate(0,0)')
      .text(this.yLabel);
    this.yAxisElement.selectAll('.tick line').remove();
  }

  private addXAxis(): void {
    this.xScale = d3.scaleLinear()
      .domain([0, this.data.length - 1])
      .domain(d3.extent<SystemResourcesPoint, number>(this.data, d => d.timestamp))
      .range([0, this.width]);
    this.xAxisElement = this.mainG.append('g')
      .attr('class', 'xAxis inter tertiary f-base user-none')
      .attr('transform', `translate(0, ${this.height})`);
    const xTicks = SystemResourcesGraphComponent.getXTicks();
    this.xAxisTicks = xTicks;
    this.xAxis = d3.axisBottom<number>(this.xScale)
      .tickSize(0)
      .ticks(xTicks)
      .tickFormat((d: number) => this.datePipe.transform(d, 'MM/dd, HH:mm'))
      .tickPadding(10);
    this.xAxisElement
      .call(this.xAxis)
      .select('.domain')
      .attr('stroke-width', 0);
    this.xAxisElement.selectAll('.tick line').remove();
  }

  private createClickerMarkers(): void {
    this.clicker
      .append('path')
      .attr('d', `M 0 ${this.height} l 6 8 l -12 0 z`)
      .attr('fill', 'var(--selected-primary)')
      .attr('stroke-width', 3)
      .attr('stroke', 'var(--selected-container)');
    this.clickerTextRect = this.clicker
      .append('rect')
      .attr('fill', 'var(--selected-container)')
      .attr('width', this.clickerConfig.width)
      .attr('height', this.clickerConfig.height)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('y', -25);
    this.clickerText = this.clicker
      .append('text')
      .attr('fill', 'var(--selected-primary)')
      .attr('class', 'f-600')
      .attr('y', -9);
  }

  private createClicker(): any {
    const clicker = this.mainG
      .append('g')
      .attr('class', 'clicker')
      .style('opacity', 0);

    clicker
      .append('rect')
      .attr('fill', 'var(--selected-primary)')
      .attr('stroke-width', 4)
      .attr('stroke', 'var(--selected-container)')
      .attr('width', 2)
      .attr('x', -1)
      .attr('y', 1)
      .attr('height', this.height);
    return clicker;
  }

  private createMainG(): any {
    return this.svg
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private createSVG(): any {
    return d3.select(this.chart.nativeElement)
      .append('svg')
      .attr('class', 'overflow-visible');
  }

  private drawPath(): void {
    this.mainG.selectAll('path.data-path').remove();
    this.lines = [];
    this.paths.forEach((path: string, i: number) => {
      const line = this.mainG.append('path')
        .datum(this.data)
        .attr('class', 'data-path')
        .attr('fill', 'none')
        .attr('stroke', this.colors[i] || this.colors[i - this.colors.length])
        .attr('stroke-width', 1)
        .attr('d', d3.line<SystemResourcesPoint>()
          .x((d: SystemResourcesPoint) => this.xScale(d.timestamp))
          .y((d: SystemResourcesPoint) => this.yScale(d.pathPoints[path].value))
          .curve(curveLinear),
        );
      this.lines.push(line);
    });
    this.paths.forEach((path: string, i: number) => {
      if (path.includes('total')) {
        this.lines[i].raise();
      }
    });
  }

  private showClicker(mouseX: number, timestamp: number): void {
    this.clickerLocationPercentage = (mouseX / this.width) * 100;
    this.clicker
      .style('opacity', 1)
      .attr('transform', `translate(${mouseX})`);

    let x: number;
    if (this.width - mouseX < this.clickerConfig.textTranslateX) {
      x = this.clickerConfig.textTranslateX + (this.clickerConfig.textTranslateX - (this.width - mouseX) + (this.clickerConfig.padding * 2));
    } else if (mouseX < this.clickerConfig.textTranslateX) {
      x = this.clickerConfig.textTranslateX - (this.clickerConfig.textTranslateX - mouseX) - (this.clickerConfig.padding * 2);
    } else {
      x = this.clickerConfig.textTranslateX;
    }
    this.clickerText
      .text(toReadableDate(timestamp, noMillisFormat))
      .attr('x', -x);

    if (this.width - mouseX < this.clickerConfig.rectTranslateX) {
      x = this.clickerConfig.rectTranslateX + (this.clickerConfig.rectTranslateX - (this.width - mouseX));
    } else if (mouseX < this.clickerConfig.rectTranslateX) {
      x = this.clickerConfig.rectTranslateX - (this.clickerConfig.rectTranslateX - mouseX);
    } else {
      x = this.clickerConfig.rectTranslateX;
    }
    this.clickerTextRect
      .attr('x', -x);
  }

  private listenToWindowResizing(): void {
    this.breakpointObserver.observe([MIN_WIDTH_1600, MIN_WIDTH_1200, MAX_WIDTH_700])
      .pipe(untilDestroyed(this), skip(1))
      .subscribe(() => {
        this.redrawChart();
      });

    fromEvent(window, 'resize')
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe(() => this.redrawChart());

    this.select(selectAppMenu, () => this.redrawChart(),
      delay(400),
      distinctUntilChanged(),
      skip(1),
      filter(() => !isMobile()),
    );
    this.select(selectSystemResourcesRedrawCharts, () => this.redrawChart(),
      skip(1)
    );
  }

  public redrawChart(): void {
    this.width = this.chart.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.svg.attr('width', this.width + this.margin.left + this.margin.right);

    this.xScale.range([0, this.width]);

    const currTicks = SystemResourcesGraphComponent.getXTicks();
    this.xAxis.ticks(currTicks);
    this.xAxis.scale(this.xScale);
    this.xAxisElement.call(this.xAxis);

    if (this.xAxisTicks !== currTicks) {
      this.xAxisElement.selectAll('g.tick line').remove();
      d3.selectAll('g.xAxis g.tick')
        .append('line')
        .attr('class', 'gridline')
        .attr('x1', 0)
        .attr('y1', -this.height)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', 'var(--base-divider)');
    }
    this.xAxisTicks = currTicks;

    d3.selectAll('g.yAxis g.tick line.gridline')
      .attr('x2', this.width);

    this.clickableRect
      .attr('width', this.width)
      .attr('height', this.height);
    if (this.clickerLocationPercentage) {
      this.showClicker(this.width * this.clickerLocationPercentage / 100, this.timestampFromRoute);
    }

    this.lines.forEach((line: any, i: number) => {
      line.attr('d', d3.line<SystemResourcesPoint>()
        .x((d: SystemResourcesPoint) => this.xScale(d.timestamp))
        .y((d: SystemResourcesPoint) => this.yScale(d.pathPoints[this.paths[i]].value))
        .curve(curveLinear),
      );
    });
  };

  private createActivePoint(point: SystemResourcesPoint): SystemResourcesActivePoint {
    return {
      point,
      title: this.title,
      colors: this.colors,
      um: this.um,
    };
  }

  private get timestampFromRoute(): number {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: searchParams => searchParams.get('timestamp'),
    });
    return Number(params['timestamp']);
  }

  private static getXTicks(): number {
    const width = window.innerWidth;
    if (isMobile()) {
      return 2.5;
    } else if (width < 1200) {
      return 5;
    } else if (width < 1600) {
      return 7;
    } else {
      return 10;
    }
  }
}
