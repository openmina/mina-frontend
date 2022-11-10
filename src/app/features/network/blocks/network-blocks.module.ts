import { NgModule } from '@angular/core';

import { NetworkBlocksRouting } from './network-blocks.routing';
import { SharedModule } from '@shared/shared.module';
import { NetworkBlocksComponent } from '@network/blocks/network-blocks.component';
import { NetworkBlocksChartComponent } from './network-blocks-chart/network-blocks-chart.component';
import { GoogleChartsModule } from 'angular-google-charts';


@NgModule({
  declarations: [
    NetworkBlocksComponent,
    NetworkBlocksChartComponent,
  ],
  imports: [
    SharedModule,
    NetworkBlocksRouting,
    GoogleChartsModule,
  ],
})
export class NetworkBlocksModule {}
