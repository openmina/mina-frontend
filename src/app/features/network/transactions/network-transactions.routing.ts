import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkTransactionsComponent } from '@network/transactions/network-transactions.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkTransactionsComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkTransactionsRouting {}
