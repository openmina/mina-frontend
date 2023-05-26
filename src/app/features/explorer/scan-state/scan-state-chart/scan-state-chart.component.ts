import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ScanStateSunburst } from '@explorer/scan-state/explorer-scan-state-chart-list/explorer-scan-state-chart-list.component';


@Component({
  selector: 'mina-scan-state-chart',
  templateUrl: './scan-state-chart.component.html',
  styleUrls: ['./scan-state-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100 w-100 flex-center align-center' },
})
export class ScanStateChartComponent implements AfterViewInit {

  @Input() data: ScanStateSunburst;
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef<HTMLDivElement>;
  @ViewChild('tooltip', { static: true }) private tooltipRef: ElementRef<HTMLDivElement>;
  private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, undefined>;

  private margin = { top: 0, right: 0, bottom: 0, left: 0 };
  private width: number;
  private height: number;

  ngAfterViewInit(): void {
    this.initGraph();
  }

  private initGraph(): void {
    this.tooltip = d3.select(this.tooltipRef.nativeElement);
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`)
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const root = d3.hierarchy<any>(this.data);
    root.sum((d: ScanStateSunburst) => d.size);

    d3.partition().size([2 * Math.PI, Math.min(this.width, this.height) / 2])(root);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const radius = Math.min(element.offsetWidth, element.offsetHeight) / 2;
    const padding = 2;

    const arc = d3.arc<any, any>()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, padding * 2 / radius))
      .padRadius(radius / 2)
      .innerRadius((d: any) => d.y0)
      .outerRadius((d: any) => d.y1 - padding);

    svg
      .selectAll('path')
      .data(root.descendants())
      .enter()
      .append('path')
      .attr('d', arc)
      .style('fill', (d: any) => {
        if (d.data.leaf[4] === 'Done') {
          return 'var(--success-primary)';
        } else if (d.data.leaf[4] === 'Todo') {
          return 'var(--aware-primary)';
        }
        return 'var(--base-container)';
      })
      .on('mouseover', (event: MouseEvent & { target: HTMLElement }, peer) => this.mouseOverHandle(peer, event))
      .on('mouseout', (event: MouseEvent & { target: HTMLElement }, peer) => this.mouseOutHandler(peer, event));

  }


  private mouseOverHandle(peer: any, event: MouseEvent & { target: HTMLElement }): void {
    const selection = this.tooltip.html(`
<div>${peer.data.leaf[0]}</div>
<div>${peer.data.leaf[1]}</div>
<div>${peer.data.leaf[2]}</div>
<div>${peer.data.leaf[3]}</div>
<div>${peer.data.leaf[4]}</div>
`)
      .style('display', 'block');

    const nodeRect = event.target.getBoundingClientRect();
    const tooltipWidth = selection.node().getBoundingClientRect().width;

    selection
      .style('left', `${nodeRect.left + nodeRect.width / 2 - tooltipWidth / 2}px`)
      .style('bottom', `${200 + 50}px`);
  }

  private mouseOutHandler(peer: any, event: MouseEvent & { target: HTMLElement }): void {
    this.tooltip.style('display', 'none');
  }
}
