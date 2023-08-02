import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DswWorkPoolRouting } from './dsw-work-pool.routing';
import { DswWorkPoolComponent } from './dsw-work-pool.component';
import { DswWorkPoolTableComponent } from './dsw-work-pool-table/dsw-work-pool-table.component';
import { DswWorkPoolSidePanelComponent } from './dsw-work-pool-side-panel/dsw-work-pool-side-panel.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { DswWorkPoolEffects } from '@dsw/work-pool/dsw-work-pool.effects';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { CopyComponent } from '@shared/components/copy/copy.component';
import { MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';


@NgModule({
  declarations: [
    DswWorkPoolComponent,
    DswWorkPoolTableComponent,
    DswWorkPoolSidePanelComponent,
  ],
  imports: [
    DswWorkPoolRouting,
    SharedModule,
    EffectsModule.forFeature(DswWorkPoolEffects),
    HorizontalResizableContainerComponent,
    CopyComponent,
    MinaJsonViewerComponent,
  ],
})
export class DswWorkPoolModule {}
