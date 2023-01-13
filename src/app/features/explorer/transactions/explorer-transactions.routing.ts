import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerTransactionsComponent } from '@explorer/transactions/explorer-transactions.component';

const routes: Routes = [
  {
    path: '',
    component: ExplorerTransactionsComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorerTransactionsRouting {}
