import { NgModule } from '@angular/core';
import { SnarkWorkersTracesComponent } from './snark-workers-traces.component';
import { SnarkWorkersTracesTableComponent } from './snark-workers-traces-table/snark-workers-traces-table.component';
import { SharedModule } from '@shared/shared.module';
import { SnarkWorkersToolbarComponent } from './snark-workers-toolbar/snark-workers-toolbar.component';
import { SnarkWorkersTracesRouting } from '@explorer/snark-workers-traces/snark-workers-traces.routing';
import { SnarkWorkersSidePanelComponent } from './snark-workers-side-panel/snark-workers-side-panel.component';
import { EffectsModule } from '@ngrx/effects';
import { SnarkWorkersTracesEffects } from '@explorer/snark-workers-traces/snark-workers-traces.effects';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { CopyComponent } from '@shared/components/copy/copy.component';
import { HorizontalMenuComponent } from '@shared/components/horizontal-menu/horizontal-menu.component';


@NgModule({
  declarations: [
    SnarkWorkersTracesComponent,
    SnarkWorkersTracesTableComponent,
    SnarkWorkersToolbarComponent,
    SnarkWorkersSidePanelComponent,
  ],
  imports: [
    SharedModule,
    CopyComponent,
    SnarkWorkersTracesRouting,
    HorizontalResizableContainerComponent,
    EffectsModule.forFeature(SnarkWorkersTracesEffects),
    HorizontalMenuComponent,
  ],
})
export class SnarkWorkersTracesModule {}
