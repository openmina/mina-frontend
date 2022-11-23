import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebNodeWalletComponent } from '@web-node/web-node-wallet/web-node-wallet.component';
import { WebNodeWalletCreateWalletComponent } from '@web-node/web-node-wallet/web-node-wallet-create-wallet/web-node-wallet-create-wallet.component';
import { WEB_NODE_TITLE } from '@app/app.routing';
import { WebNodeWalletTransactionsComponent } from '@web-node/web-node-wallet/web-node-wallet-transactions/web-node-wallet-transactions.component';
import {
  WebNodeWalletCreateTransactionComponent,
} from '@web-node/web-node-wallet/web-node-wallet-create-transaction/web-node-wallet-create-transaction.component';

const routes: Routes = [
  {
    path: '',
    component: WebNodeWalletComponent,
    children: [
      {
        path: '',
        component: WebNodeWalletTransactionsComponent,
        title: WEB_NODE_TITLE,
      },
      {
        path: 'new',
        component: WebNodeWalletCreateWalletComponent,
        title: WEB_NODE_TITLE,
      },
      {
        path: 'new-stressing',
        component: WebNodeWalletCreateTransactionComponent,
        title: WEB_NODE_TITLE,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '',
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: '',
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebNodeWalletRouting {}
