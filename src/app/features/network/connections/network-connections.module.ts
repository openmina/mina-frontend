import { NgModule } from '@angular/core';

import { NetworkConnectionsRouting } from './network-connections.routing';
import { NetworkConnectionsComponent } from './network-connections.component';
import { SharedModule } from '@shared/shared.module';
import { NetworkConnectionsTableComponent } from './network-connections-table/network-connections-table.component';
import { NetworkConnectionsSidePanelComponent } from './network-connections-side-panel/network-connections-side-panel.component';
import { EffectsModule } from '@ngrx/effects';
import { NetworkConnectionsEffects } from '@network/connections/network-connections.effects';
import { MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';


@NgModule({
  declarations: [
    NetworkConnectionsComponent,
    NetworkConnectionsTableComponent,
    NetworkConnectionsSidePanelComponent,
  ],
  imports: [
    SharedModule,
    MinaJsonViewerComponent,
    HorizontalResizableContainerOldComponent,
    NetworkConnectionsRouting,
    EffectsModule.forFeature([NetworkConnectionsEffects]),
  ],
})
export class NetworkConnectionsModule {}
