import { NgModule } from '@angular/core';

import { NetworkSnarksComponent } from './network-snarks.component';
import { NetworkSnarksRouting } from '@network/snarks/network-snarks.routing';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { NetworkSnarksEffects } from '@network/snarks/network-snarks.effects';
import { NetworkSnarksTableComponent } from './network-snarks-table/network-snarks-table.component';


@NgModule({
  declarations: [
    NetworkSnarksComponent,
    NetworkSnarksTableComponent,
  ],
  imports: [
    SharedModule,
    EffectsModule.forFeature([NetworkSnarksEffects]),
    NetworkSnarksRouting,
  ],
})
export class NetworkSnarksModule {}
