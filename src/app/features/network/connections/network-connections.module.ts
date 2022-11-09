import { NgModule } from '@angular/core';

import { NetworkConnectionsRouting } from './network-connections.routing';
import { NetworkConnectionsComponent } from './network-connections.component';
import { SharedModule } from '@shared/shared.module';
import { NetworkConnectionsTableComponent } from './network-connections-table/network-connections-table.component';
import { NetworkConnectionsSidePanelComponent } from './network-connections-side-panel/network-connections-side-panel.component';
import { NetworkConnectionsToolbarComponent } from './network-connections-toolbar/network-connections-toolbar.component';
import { EffectsModule } from '@ngrx/effects';
import { NetworkConnectionsEffects } from '@network/connections/network-connections.effects';


@NgModule({
  declarations: [
    NetworkConnectionsComponent,
    NetworkConnectionsTableComponent,
    NetworkConnectionsSidePanelComponent,
    NetworkConnectionsToolbarComponent,
  ],
  imports: [
    SharedModule,
    NetworkConnectionsRouting,
    EffectsModule.forFeature([NetworkConnectionsEffects]),
  ],
})
export class NetworkConnectionsModule {}
