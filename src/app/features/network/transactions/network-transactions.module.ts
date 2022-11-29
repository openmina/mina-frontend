import { NgModule } from '@angular/core';

import { NetworkTransactionsRouting } from './network-transactions.routing';
import { NetworkTransactionsComponent } from './network-transactions.component';
import { SharedModule } from '@shared/shared.module';
import { NetworkTransactionsTableComponent } from './network-transactions-table/network-transactions-table.component';
import { EffectsModule } from '@ngrx/effects';
import { NetworkTransactionsEffects } from '@network/transactions/network-transactions.effects';


@NgModule({
  declarations: [
    NetworkTransactionsComponent,
    NetworkTransactionsTableComponent,
  ],
  imports: [
    SharedModule,
    NetworkTransactionsRouting,
    EffectsModule.forFeature([NetworkTransactionsEffects])
  ],
})
export class NetworkTransactionsModule {}
