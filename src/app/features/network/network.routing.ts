import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkComponent } from '@network/network.component';
import { NETWORK_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: NetworkComponent,
    children: [
      {
        path: 'messages',
        loadChildren: () => import('./messages/network-messages.module').then(m => m.NetworkMessagesModule),
        title: NETWORK_TITLE,
      },
      {
        path: 'connections',
        loadChildren: () => import('./connections/network-connections.module').then(m => m.NetworkConnectionsModule),
        title: NETWORK_TITLE,
      },
      {
        path: 'blocks',
        loadChildren: () => import('./blocks/network-blocks.module').then(m => m.NetworkBlocksModule),
        title: NETWORK_TITLE,
      },
      {
        path: 'snarks',
        loadChildren: () => import('./snarks/network-snarks.module').then(m => m.NetworkSnarksModule),
        title: NETWORK_TITLE,
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/network-transactions.module').then(m => m.NetworkTransactionsModule),
        title: NETWORK_TITLE,
      },
      {
        path: 'global',
        loadChildren: () => import('./global/network-global.module').then(m => m.NetworkGlobalModule),
        title: NETWORK_TITLE,
      },
      {
        path: '**',
        redirectTo: 'messages',
        pathMatch: 'full',
      },
    ],
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
export class NetworkRoutingModule {}
