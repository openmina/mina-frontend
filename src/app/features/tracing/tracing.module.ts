import { NgModule } from '@angular/core';

import { TracingRouting } from './tracing.routing';
import { TracingComponent } from './tracing.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    TracingComponent,
  ],
  imports: [
    TracingRouting,
    CommonModule,
  ],
})
export class TracingModule {}
