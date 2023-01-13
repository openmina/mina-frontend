import { NgModule } from '@angular/core';

import { DashboardRouting } from './dashboard.routing';
import { DashboardComponent } from '@dashboard/dashboard.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    SharedModule,
    DashboardRouting,
  ],
})
export class DashboardModule {}
