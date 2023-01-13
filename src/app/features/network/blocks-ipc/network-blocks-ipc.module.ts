import { NgModule } from '@angular/core';

import { NetworkBlocksIpcRouting } from './network-blocks-ipc.routing';
import { NetworkBlocksIpcComponent } from './network-blocks-ipc.component';
import { NetworkBlocksIpcTableComponent } from './network-blocks-ipc-table/network-blocks-ipc-table.component';
import { NetworkBlocksIpcToolbarComponent } from './network-blocks-ipc-toolbar/network-blocks-ipc-toolbar.component';
import { NetworkBlocksIpcSidePanelComponent } from './network-blocks-ipc-side-panel/network-blocks-ipc-side-panel.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { NetworkBlocksIpcEffects } from '@network/blocks-ipc/network-blocks-ipc.effects';


@NgModule({
  declarations: [
    NetworkBlocksIpcComponent,
    NetworkBlocksIpcTableComponent,
    NetworkBlocksIpcToolbarComponent,
    NetworkBlocksIpcSidePanelComponent,
  ],
  imports: [
    SharedModule,
    NetworkBlocksIpcRouting,
    EffectsModule.forFeature([NetworkBlocksIpcEffects]),
  ],
})
export class NetworkBlocksIpcModule {}

