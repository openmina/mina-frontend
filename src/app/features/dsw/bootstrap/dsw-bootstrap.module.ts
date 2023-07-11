import { NgModule } from '@angular/core';

import { DswBootstrapRouting } from './dsw-bootstrap.routing';
import { DswBootstrapComponent } from './dsw-bootstrap.component';
import { DswBootstrapTableComponent } from './dsw-bootstrap-table/dsw-bootstrap-table.component';
import { DswBootstrapSidePanelComponent } from './dsw-bootstrap-side-panel/dsw-bootstrap-side-panel.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { DswBootstrapEffects } from '@dsw/bootstrap/dsw-bootstrap.effects';


@NgModule({
  declarations: [
    DswBootstrapComponent,
    DswBootstrapTableComponent,
    DswBootstrapSidePanelComponent,
  ],
  imports: [
    SharedModule,
    DswBootstrapRouting,
    HorizontalResizableContainerComponent,
    EffectsModule.forFeature(DswBootstrapEffects),
  ],
})
export class DswBootstrapModule {}
