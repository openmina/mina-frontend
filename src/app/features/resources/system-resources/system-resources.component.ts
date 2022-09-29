import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SystemResourcesService } from '@system-resources/system-resources.service';
import { DatePipe } from '@angular/common';
// import '@google-web-components/google-chart';

declare const google: any;

@Component({
  selector: 'mina-system-resources',
  templateUrl: './system-resources.component.html',
  styleUrls: ['./system-resources.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemResourcesComponent implements OnInit {

  // @ViewChild('mouseListener') mouseListener: ElementRef;
  //
  // lineChartData: ChartConfiguration<'line'>['data'] = {
  //   labels: [
  //     'January',
  //     'February',
  //     'March',
  //     'April',
  //     'May',
  //     'June',
  //     'July',
  //   ],
  //   datasets: [
  //     {
  //       data: [],
  //       label: 'Node',
  //       fill: false,
  //       tension: 0.5,
  //       borderWidth: 1,
  //       pointRadius: 1,
  //     },
  //     {
  //       data: [],
  //       label: 'Validators',
  //       fill: false,
  //       tension: 0.5,
  //       borderWidth: 1,
  //       pointRadius: 1,
  //     },
  //     {
  //       data: [],
  //       label: 'Total',
  //       fill: false,
  //       tension: 0.5,
  //       borderWidth: 1,
  //       pointRadius: 1,
  //     },
  //   ],
  // };
  // lineChartOptions: ChartOptions = {
  //   responsive: false,
  //   hover: {},
  //   onHover(event: ChartEvent, elements: ActiveElement[], chart: Chart) {
  //   },
  //   scales: {
  //     xAxes: {
  //       display: true,
  //       time: {
  //         displayFormats: {
  //           millisecond: 'D MMM, h:mm a',
  //           second: 'D MMM, h:mm a',
  //           minute: 'D MMM, h:mm a',
  //           hour: 'D MMM, h:mm a',
  //           day: 'D MMM, h:mm a',
  //           week: 'll',
  //           month: 'll',
  //           quarter: 'll',
  //           year: 'll',
  //         },
  //       },
  //       ticks: {
  //         autoSkip: true,
  //         maxTicksLimit: 15,
  //         callback: (value: number | string, index, values) => {
  //           return new Date(value).toLocaleDateString();
  //         },
  //       },
  //     },
  //   },
  //   plugins: {
  //     // {
  //     //   tooltip: {
  //     //     enabled: true,
  //     //     mode: 'index',
  //     //     intersect: false,
  //     //     position: 'nearest',
  //     //     xAlign: 'center',
  //     //     animation: {
  //     //       delay: 0,
  //     //       duration: 0,
  //     //     },
  //     //   },
  //     //
  //     // },
  //   },
  // };
  // lineChartLegend = true;
  resources: any;

  // chartData = {
  //   type: ChartType.LineChart,
  //   data: [
  //     ['Jan', 500, 600],
  //     ['Feb', 800, 900],
  //     ['Mar', 400, 600],
  //     ['Apr', 600, 500],
  //     ['May', 400, 300],
  //     ['Jun', 750, 700],
  //     ['Jul', 800, 710],
  //     ['Aug', 810, 720],
  //     ['Sep', 820, 730],
  //     ['Oct', 900, 840],
  //     ['Nov', 910, 850],
  //     ['Dec', 920, 890],
  //   ],
  //   columnNames: ['Month', 'Apple', 'Mi'],
  //   options: {
  //     hAxis: {
  //       title: 'Month',
  //     },
  //     vAxis: {
  //       title: 'Sell',
  //     },
  //   },
  //   width: 1000,
  //   height: 400,
  // };

  chartData: any = [
    ['Time', 'Node', 'Validators'],
  ];

  constructor(private service: SystemResourcesService,
              private datePipe: DatePipe,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.service.getResources().subscribe(resources => {
      this.resources = resources;
      // this.lineChartData.labels = resources.cpu.map((cpu: any) => cpu.timestamp);
      // this.lineChartData.datasets[0].data = resources.cpu.map((cpu: any) => cpu.node);
      // this.lineChartData.datasets[1].data = resources.cpu.map((cpu: any) => cpu.validators);
      // this.lineChartData.datasets[2].data = resources.cpu.map((cpu: any) => cpu.total);
      resources.cpu.forEach((cpu: any) => {
        this.chartData.push([new Date(cpu.timestamp), cpu.node, cpu.validators]);
      });
      this.makeChart();
      this.cdRef.detectChanges();
    });
  }

  private makeChart(): void {
    const draw = () => {
      const data = google.visualization.arrayToDataTable(this.chartData);

      const options = {
        focusTarget: 'category',
        crosshair: { orientation: 'vertical', trigger: 'focus' },
        hAxis: {
          logScale: false,
          format: 'yyyy-MM-dd',
        },
        vAxis: {
          title: 'CPU',
          logScale: false,
        },
        colors: ['#a52714', '#097138'],
      };

      const chart = new google.visualization.LineChart(document.getElementById('chart_div'));

      chart.draw(data, options);
    };

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(draw);
    //
    // google.charts.load('current', {'packages':['corechart']});
    //
    // // Set a callback to run when the Google Visualization API is loaded.
    // google.charts.setOnLoadCallback(drawChart);
    //
    // // Callback that creates and populates a data table,
    // // instantiates the pie chart, passes in the data and
    // // draws it.
    // function drawChart() {
    //
    //   // Create the data table.
    //   var data = new google.visualization.DataTable();
    //   data.addColumn('string', 'Topping');
    //   data.addColumn('number', 'Slices');
    //   data.addRows([
    //     ['Mushrooms', 3],
    //     ['Onions', 1],
    //     ['Olives', 1],
    //     ['Zucchini', 1],
    //     ['Pepperoni', 2]
    //   ]);
    //
    //   // Set chart options
    //   var options = {'title':'How Much Pizza I Ate Last Night',
    //     'width':400,
    //     'height':300};
    //
    //   // Instantiate and draw our chart, passing in some options.
    //   var chart = new google.visualization.PieChart(document.getElementById('chart_div') as any);
    //   chart.draw(data, options);
    // }
  }

  // private makeChart(): void {
  //   Chart.register(...registerables);
  //   const myChart = new Chart(document.getElementById('myChart') as any, {
  //     type: 'line',
  //     data: {
  //       labels: this.resources.cpu.map((cpu: any) => cpu.timestamp),
  //       datasets: [{
  //         label: 'Node',
  //         data: this.resources.cpu.map((cpu: any) => cpu.node),
  //         backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //         borderColor: 'rgba(255, 99, 132, 1)',
  //         borderWidth: 1,
  //       }],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //         },
  //       },
  //
  //       hover: {
  //         mode: 'x',
  //         intersect: false,
  //       },
  //       plugins: {
  //         tooltip: {
  //           mode: 'x',
  //           intersect: false,
  //         },
  //       },
  //     },
  //   });
  // }
  //
  // onMouseMove(evt: MouseEvent) {
  //   console.log(evt);
  //   const element = this.mouseListener.nativeElement;
  //   const offsetLeft = Number(element.offsetX);
  //   const domElement = element.get(0);
  //   const clientX = evt.clientX - offsetLeft;
  //   const ctx = element.get(0).getContext('2d');
  //
  //   ctx.clearRect(0, 0, domElement.width, domElement.height);
  //   ctx.beginPath();
  //   ctx.moveTo(clientX, 0);
  //   ctx.lineTo(clientX, domElement.height);
  //   ctx.setLineDash([10, 10]);
  //   ctx.strokeStyle = '#333';
  //   ctx.stroke();
  //
  // }
}
