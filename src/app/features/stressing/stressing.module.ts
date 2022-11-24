import { NgModule } from '@angular/core';
import { StressingComponent } from './stressing.component';
import { SharedModule } from '@shared/shared.module';
import { StressingRouting } from '@app/features/stressing/stressing.routing';
import { StressingWalletsComponent } from './stressing-wallets/stressing-wallets.component';
import { StressingTransactionsComponent } from './stressing-transactions/stressing-transactions.component';
import { EffectsModule } from '@ngrx/effects';
import { StressingEffects } from '@stressing/stressing.effects';
import { StressingToolbarComponent } from './stressing-toolbar/stressing-toolbar.component';


@NgModule({
  declarations: [
    StressingComponent,
    StressingWalletsComponent,
    StressingTransactionsComponent,
    StressingToolbarComponent,
  ],
  imports: [
    SharedModule,
    StressingRouting,
    EffectsModule.forFeature([StressingEffects]),
  ],
})
export class StressingModule {}
