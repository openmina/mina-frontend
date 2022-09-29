import { NgModule } from '@angular/core';
import { TracingOverviewComponent } from './tracing-overview.component';
import { TracingOverviewRouting } from '@tracing/tracing-overview/tracing-overview.routing';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { TracingOverviewEffects } from '@tracing/tracing-overview/tracing-overview.effects';
import { TracingOverviewGraphComponent } from './tracing-overview-graph/tracing-overview-graph.component';
import { TracingOverviewGraphListComponent } from './tracing-overview-graph-list/tracing-overview-graph-list.component';
import { TracingOverviewToolbarComponent } from './tracing-overview-toolbar/tracing-overview-toolbar.component';
import { TracingOverviewGraphTooltipComponent } from './tracing-overview-graph-tooltip/tracing-overview-graph-tooltip.component';


@NgModule({
  declarations: [
    TracingOverviewComponent,
    TracingOverviewGraphComponent,
    TracingOverviewGraphListComponent,
    TracingOverviewToolbarComponent,
    TracingOverviewGraphTooltipComponent,
  ],
  imports: [
    SharedModule,
    TracingOverviewRouting,
    EffectsModule.forFeature([TracingOverviewEffects]),
  ],
})
export class TracingOverviewModule {}
