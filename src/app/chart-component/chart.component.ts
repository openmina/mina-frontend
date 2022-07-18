import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { ChartService } from '@app/chart-component/chart.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ChartComponent implements AfterViewInit, OnDestroy {
  private root: am5.Root | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private zone: NgZone,
              private chartService: ChartService) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.chartService.getResources().subscribe((chartData) => {
      this.browserOnly(() => {

        let root = am5.Root.new('chartdiv');
        root.setThemes([
          am5themes_Animated.new(root),
        ]);
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: 'panX',
          wheelY: 'zoomX',
          pinchZoomX: true,
        }));
        var cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
          behavior: 'none',
        }));
        cursor.lineY.set('visible', false);

        var date = new Date();
        date.setHours(0, 0, 0, 0);
        var value = 100;

        function generateData() {
          value = Math.round((Math.random() * 10 - 5) + value);
          am5.time.add(date, 'day', 1);
          return {
            date: date.getTime(),
            value: value,
          };
        }

        function generateDatas(cc: any) {
          var data = [];
          for (var i = 0; i < cc; ++i) {
            data.push(generateData());
          }
          return data;
        }

        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
          categoryField: 'category',
          renderer: am5xy.AxisRendererX.new(root, {}),
        }));
        xAxis.get('renderer').labels.template.adapters.add('text', (text: any, target: any) => {
          // console.log(target.dataItem);
          // console.log(target.dataItem.values);
          // console.log(target.valueY.value);
          if (!target.dataItem) {
            return target;
          }
          console.log(target.dataItem);
          return target;
        });
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        }));

        var series = chart.series.push(am5xy.LineSeries.new(root, {
          name: 'Series',
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'value',
          valueXField: 'date',
          tooltip: am5.Tooltip.new(root, {
            labelText: '{valueY}',
          }),
        }));

        chart.set('scrollbarX', am5.Scrollbar.new(root, {
          orientation: 'horizontal',
        }));

        // var data = generateDatas(1200);
        // console.log(data);

        let data = chartData.map((response: any) => ({
          date: response.timestamp * 1000,
          value: Math.floor(response.cpu.node.collective),
        }));
        console.log(data);


        series.data.setAll(data);

        series.appear(1000);
        chart.appear(1000, 100);
        this.root = root;
      });
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
