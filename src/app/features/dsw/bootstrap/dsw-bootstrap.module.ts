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
import { DswBootstrapBlocksComponent } from './dsw-bootstrap-blocks/dsw-bootstrap-blocks.component';
import { MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';


@NgModule({
  declarations: [
    DswBootstrapComponent,
    DswBootstrapTableComponent,
    DswBootstrapSidePanelComponent,
    DswBootstrapOverviewComponent,
    DswBootstrapBlocksComponent,
  ],
  imports: [
    SharedModule,
    DswBootstrapRouting,
    HorizontalResizableContainerComponent,
    EffectsModule.forFeature(DswBootstrapEffects),
    CopyComponent,
    MinaJsonViewerComponent,
  ],
})
export class DswBootstrapModule {}
