import { NgModule } from '@angular/core';

import { DswBootstrapRouting } from './dsw-bootstrap.routing';
import { DswBootstrapComponent } from './dsw-bootstrap.component';
import { DswBootstrapTableComponent } from './dsw-bootstrap-table/dsw-bootstrap-table.component';
import { DswBootstrapSidePanelComponent } from './dsw-bootstrap-side-panel/dsw-bootstrap-side-panel.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { DswBootstrapEffects } from '@dsw/bootstrap/dsw-bootstrap.effects';
import { CopyComponent } from '@shared/components/copy/copy.component';
import { DswBootstrapOverviewComponent } from './dsw-bootstrap-overview/dsw-bootstrap-overview.component';


@NgModule({
  declarations: [
    DswBootstrapComponent,
    DswBootstrapTableComponent,
    DswBootstrapSidePanelComponent,
    DswBootstrapOverviewComponent,
  ],
  imports: [
    SharedModule,
    DswBootstrapRouting,
    HorizontalResizableContainerComponent,
    EffectsModule.forFeature(DswBootstrapEffects),
    CopyComponent,
  ],
})
export class DswBootstrapModule {}
