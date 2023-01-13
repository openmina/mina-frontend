import { NgModule } from '@angular/core';

import { ExplorerTransactionsComponent } from './explorer-transactions.component';
import { ExplorerTransactionsTableComponent } from './explorer-transactions-table/explorer-transactions-table.component';
import { ExplorerTransactionsRouting } from '@explorer/transactions/explorer-transactions.routing';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { ExplorerTransactionsEffects } from '@explorer/transactions/explorer-transactions.effects';


@NgModule({
  declarations: [
    ExplorerTransactionsComponent,
    ExplorerTransactionsTableComponent,
  ],
  imports: [
    SharedModule,
    ExplorerTransactionsRouting,
    EffectsModule.forFeature([ExplorerTransactionsEffects]),
  ],
})
export class ExplorerTransactionsModule {}
