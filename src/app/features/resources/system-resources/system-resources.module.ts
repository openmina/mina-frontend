import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemResourcesComponent } from './system-resources.component';
import { SystemResourcesRouting } from '@system-resources/system-resources.routing';
import { SystemResourcesGraphComponent } from '@system-resources/system-resources-graph/system-resources-graph.component';
import { GoogleChartsModule } from 'angular-google-charts';


@NgModule({
  declarations: [
    SystemResourcesComponent,
    SystemResourcesGraphComponent,
  ],
  imports: [
    CommonModule,
    SystemResourcesRouting,
    GoogleChartsModule,
  ],
})
export class SystemResourcesModule {}
