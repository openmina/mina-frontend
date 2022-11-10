import { ChangeDetectionStrategy, Component, OnInit, Renderer2 } from '@angular/core';
import { ThemeSwitcherService } from '@core/services/theme-switcher.service';
import { Theme } from '@shared/types/core/theme/theme.type';
import { BASE_CSS_PREFIX, SELECTED_CSS_PREFIX } from '@shared/types/core/theme/theme-css-category.type';
import ColumnChartOptions = google.visualization.ColumnChartOptions;

declare const google: any;


@Component({
  selector: 'mina-network-blocks-chart',
  templateUrl: './network-blocks-chart.component.html',
  styleUrls: ['./network-blocks-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkBlocksChartComponent implements OnInit {

  constructor(private themeSwitcherService: ThemeSwitcherService,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const theme: Theme = this.themeSwitcherService.getThemeConfiguration();


    const drawMultSeries = () => {
      // var data = new google.visualization.DataTable();
      // data.addColumn('timeofday', 'Time of Day');
      // data.addColumn('number', 'Motivation Level');
      // data.addColumn('number', 'Energy Level');

      // data.addRows([
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

      const data = google.visualization.arrayToDataTable([
        ['Block height', 'Time (s)', { role: 'style' }],
        [181000, 14, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181001, 53, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181002, 5, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181003, 8, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181004, 1, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181005, 13, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181006, 48, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181007, 83, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181008, 5, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181009, 36, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181010, 20, theme.categories.selected[`${SELECTED_CSS_PREFIX}primary`]],
        [181011, 3, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
        [181012, 20, theme.categories.base[`${BASE_CSS_PREFIX}surface-top`]],
      ]);

      const options: ColumnChartOptions = {
        width: 600,
        height: 400,
        legend: 'none',
        bar: { groupWidth: '90%' },
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

      };

      const chart = new google.visualization.ColumnChart(document.getElementById('blocksChart'));

      google.visualization.events.addListener(chart, 'ready', () => {
        document.querySelectorAll('#blocksChart svg g g g:first-child rect').forEach((element: Element) => {
          this.renderer.setStyle(element, 'fill', theme.categories.base[`${BASE_CSS_PREFIX}divider`]);
        });
      });

      chart.draw(data, options);
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
