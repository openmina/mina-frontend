import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BenchmarksTransactionsComponent } from '@benchmarks/transactions/benchmarks-transactions.component';

const routes: Routes = [
  {
    path: '',
    component: BenchmarksTransactionsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenchmarksTransactionsRouting { }
