import { NgModule } from '@angular/core';
import { SnarkWorkersTracesComponent } from './snark-workers-traces.component';
import { SnarkWorkersTracesTableComponent } from './snark-workers-traces-table/snark-workers-traces-table.component';
import { SharedModule } from '@shared/shared.module';
import { SnarkWorkersToolbarComponent } from './snark-workers-toolbar/snark-workers-toolbar.component';
import { SnarkWorkersTracesRouting } from '@explorer/snark-workers-traces/snark-workers-traces.routing';
import { SnarkWorkersSidePanelComponent } from './snark-workers-side-panel/snark-workers-side-panel.component';
import { EffectsModule } from '@ngrx/effects';
import { SnarkWorkersTracesEffects } from '@explorer/snark-workers-traces/snark-workers-traces.effects';


@NgModule({
  declarations: [
    SnarkWorkersTracesComponent,
    SnarkWorkersTracesTableComponent,
    SnarkWorkersToolbarComponent,
    SnarkWorkersSidePanelComponent,
  ],
  imports: [
    SharedModule,
    SnarkWorkersTracesRouting,
    EffectsModule.forFeature([SnarkWorkersTracesEffects]),
  ],
})
export class SnarkWorkersTracesModule {}
