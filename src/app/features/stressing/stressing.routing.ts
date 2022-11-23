import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StressingComponent } from '@app/features/stressing/stressing.component';
import { StressingWalletsComponent } from '@app/features/stressing/stressing-wallets/stressing-wallets.component';
import { STRESSING_TITLE } from '@app/app.routing';
import { StressingTransactionsComponent } from '@app/features/stressing/stressing-transactions/stressing-transactions.component';

const routes: Routes = [
  {
    path: '',
    component: StressingComponent,
    children: [
      {
        path: 'wallets',
        component: StressingWalletsComponent,
        title: STRESSING_TITLE,
      },
      {
        path: 'transactions',
        component: StressingTransactionsComponent,
        title: STRESSING_TITLE,
      },
      {
        path: '**',
        redirectTo: 'wallets',
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StressingRouting {}
