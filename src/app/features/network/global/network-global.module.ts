import { NgModule } from '@angular/core';

import { NetworkGlobalComponent } from './network-global.component';
import { NetworkGlobalTableComponent } from './network-global-table/network-global-table.component';
import { NetworkGlobalRouting } from '@network/global/network-global.routing';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { NetworkGlobalEffects } from '@network/global/network-global.effects';


@NgModule({
  declarations: [
    NetworkGlobalComponent,
    NetworkGlobalTableComponent,
  ],
  imports: [
    SharedModule,
    NetworkGlobalRouting,
    EffectsModule.forFeature([NetworkGlobalEffects]),
  ],
})
export class NetworkGlobalModule {}
