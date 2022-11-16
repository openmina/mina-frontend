import { NgModule } from '@angular/core';

import { NetworkBlocksRouting } from './network-blocks.routing';
import { SharedModule } from '@shared/shared.module';
import { NetworkBlocksComponent } from '@network/blocks/network-blocks.component';
import { NetworkBlocksTableComponent } from './network-blocks-table/network-blocks-table.component';
import { NetworkBlocksGraphComponent } from './network-blocks-graph/network-blocks-graph.component';
import { EffectsModule } from '@ngrx/effects';
import { NetworkBlocksEffects } from '@network/blocks/network-blocks.effects';


@NgModule({
  declarations: [
    NetworkBlocksComponent,
    NetworkBlocksTableComponent,
    NetworkBlocksGraphComponent,
  ],
  imports: [
    SharedModule,
    NetworkBlocksRouting,
    EffectsModule.forFeature([NetworkBlocksEffects]),
  ],
})
export class NetworkBlocksModule {}
