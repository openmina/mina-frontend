import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BenchmarksTransactionsRouting } from './benchmarks-transactions.routing';
import { SharedModule } from '@shared/shared.module';
import { BenchmarksTransactionsTableComponent } from '@benchmarks/transactions/benchmarks-transactions-table/benchmarks-transactions-table.component';
import { BenchmarksTransactionsComponent } from '@benchmarks/transactions/benchmarks-transactions.component';
import { EffectsModule } from '@ngrx/effects';
import { BenchmarksTransactionsEffects } from '@benchmarks/transactions/benchmarks-transactions.effects';


@NgModule({
  declarations: [
    BenchmarksTransactionsTableComponent,
    BenchmarksTransactionsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    BenchmarksTransactionsRouting,
    EffectsModule.forFeature([BenchmarksTransactionsEffects]),
  ],
})

export class BenchmarksTransactionsModule {}
