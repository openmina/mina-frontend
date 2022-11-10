import { NgModule } from '@angular/core';

import { NetworkBlocksRouting } from './network-blocks.routing';
import { SharedModule } from '@shared/shared.module';
import { NetworkBlocksComponent } from '@network/blocks/network-blocks.component';
import { NetworkBlocksChartComponent } from './network-blocks-chart/network-blocks-chart.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { NetworkBlocksTableComponent } from './network-blocks-table/network-blocks-table.component';
import { NetworkBlocksGraphComponent } from './network-blocks-graph/network-blocks-graph.component';


@NgModule({
  declarations: [
    NetworkBlocksComponent,
    NetworkBlocksChartComponent,
    NetworkBlocksTableComponent,
    NetworkBlocksGraphComponent,
  ],
  imports: [
    SharedModule,
    NetworkBlocksRouting,
    GoogleChartsModule,
  ],
})
export class NetworkBlocksModule {}
