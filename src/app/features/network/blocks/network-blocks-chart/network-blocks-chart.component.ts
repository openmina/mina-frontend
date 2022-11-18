import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ThemeSwitcherService } from '@core/services/theme-switcher.service';
import { Theme } from '@shared/types/core/theme/theme.type';
import { BASE_CSS_PREFIX, SELECTED_CSS_PREFIX } from '@shared/types/core/theme/theme-css-category.type';
import { NetworkBlocksService } from '@network/blocks/network-blocks.service';
import ColumnChartOptions = google.visualization.ColumnChartOptions;

declare const google: any;


@Component({
  selector: 'mina-network-blocks-chart',
  templateUrl: './network-blocks-chart.component.html',
  styleUrls: ['./network-blocks-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkBlocksChartComponent implements OnInit {

  blocks: any[];

  constructor(private themeSwitcherService: ThemeSwitcherService,
              private el: ElementRef,
              private networkBlocksService: NetworkBlocksService,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.networkBlocksService.getBlockMessages(600).subscribe(blocks => {
      this.blocks = blocks;
      this.initChart();

    });
  }

  private initChart(): void {
    const theme: Theme = this.themeSwitcherService.getThemeConfiguration();

    const drawMultSeries = () => {
      // var dataTable = new google.visualization.DataTable();
      // dataTable.addColumn('timeofday', 'Time of Day');
      // dataTable.addColumn('number', 'Motivation Level');
      // dataTable.addColumn('number', 'Energy Level');

      // dataTable.addRows([
      //   [{v: [8, 0, 0], f: '8 am'}, 1, .25],
      //   [{v: [9, 0, 0], f: '9 am'}, 2, .5],
      //   [{v: [10, 0, 0], f:'10 am'}, 3, 1],
      //   [{v: [11, 0, 0], f: '11 am'}, 4, 2.25],
      //   [{v: [12, 0, 0], f: '12 pm'}, 5, 2.25],
      //   [{v: [13, 0, 0], f: '1 pm'}, 6, 3],
      //   [{v: [14, 0, 0], f: '2 pm'}, 7, 4],
      //   [{v: [15, 0, 0], f: '3 pm'}, 8, 5.25],
      //   [{v: [16, 0, 0], f: '4 pm'}, 9, 7.5],
      //   [{v: [17, 0, 0], f: '5 pm'}, 10, 10],
      // ]);

      const dataTable = new google.visualization.DataTable();
      dataTable.addColumn('number', 'Block height');
      dataTable.addColumn('number', 'Time (s)');
      dataTable.addColumn({ role: 'style' });
      dataTable.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });

      const getTooltip = (blockHeight: number, seconds: number) => {
        return `
          <div class="bg-surface-top popup-box-shadow-weak border-remove border-rad-4 p-8 secondary">
            <div class="mb-5">${blockHeight}</div>
            <div>Time (s): ${seconds}</div>
          </div>
        `;
      };

      const blocks = this.blocks.map(bl => [bl.blockLevel, bl.received])
      //   [
      //   [181000, 14],
      //   [181001, 53],
      //   [181002, 5],
      //   [181003, 8],
      //   [181004, 1],
      //   [181005, 13],
      //   [181006, 48],
      //   [181007, 83],
      //   [181008, 5],
      //   [181009, 36],
      //   [181010, 20],
      //   [181011, 3],
      //   [181012, 20],
      // ];

      dataTable.addRows([
        [blocks[0][0], blocks[0][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[0][0], blocks[0][1])],
        [blocks[1][0], blocks[1][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[1][0], blocks[1][1])],
        [blocks[2][0], blocks[2][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[2][0], blocks[2][1])],
        [blocks[3][0], blocks[3][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[3][0], blocks[3][1])],
        [blocks[4][0], blocks[4][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[4][0], blocks[4][1])],
        [blocks[5][0], blocks[5][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[5][0], blocks[5][1])],
        [blocks[6][0], blocks[6][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[6][0], blocks[6][1])],
        [blocks[7][0], blocks[7][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[7][0], blocks[7][1])],
        [blocks[8][0], blocks[8][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[8][0], blocks[8][1])],
        [blocks[9][0], blocks[9][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[9][0], blocks[9][1])],
        [blocks[10][0], blocks[10][1], theme.categories.selected[`${SELECTED_CSS_PREFIX}primary`], getTooltip(blocks[10][0], blocks[10][1])],
        [blocks[11][0], blocks[11][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[11][0], blocks[11][1])],
        [blocks[12][0], blocks[12][1], theme.categories.base[`${BASE_CSS_PREFIX}surface-top`], getTooltip(blocks[12][0], blocks[12][1])],
      ]);

      const options: ColumnChartOptions = {
        width: this.el.nativeElement.offsetWidth,
        height: this.el.nativeElement.offsetHeight,
        legend: 'none',
        bar: { groupWidth: '100%' },
        isStacked: true,
        backgroundColor: 'transparent',
        hAxis: {
          gridlines: {
            color: 'transparent',
          },
          format: '',
          textStyle: {
            color: getHexFromRGBA(theme.categories.base[`${BASE_CSS_PREFIX}tertiary`]),
            opacity: getOpacityFromColor(theme.categories.base[`${BASE_CSS_PREFIX}tertiary`]),
          },
        },
        vAxis: {
          gridlines: {
            color: '#ff0000',
          },
          textStyle: {
            color: getHexFromRGBA(theme.categories.base[`${BASE_CSS_PREFIX}tertiary`]),
            opacity: getOpacityFromColor(theme.categories.base[`${BASE_CSS_PREFIX}tertiary`]),
          },
        },
        tooltip: {
          isHtml: true,
        },

      };

      const chart = new google.visualization.ColumnChart(document.getElementById('blocksChart'));

      google.visualization.events.addListener(chart, 'ready', () => {
        document.querySelectorAll('#blocksChart svg g g g:first-child rect').forEach((element: Element) => {
          this.renderer.setStyle(element, 'fill', theme.categories.base[`${BASE_CSS_PREFIX}divider`]);
        });
      });

      chart.draw(dataTable, options);
    };

    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawMultSeries);
  }
}

function getHexFromRGBA(color: string): string {
  const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

  return `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`;
}

function getOpacityFromColor(color: string): number {
  if (color.includes('#')) {
    return 1;
  }

  return Number(color.substring(color.lastIndexOf(',') + 1, color.indexOf(')')));
}
