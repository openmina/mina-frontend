import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebNodeComponent } from '@web-node/web-node.component';
import { WEB_NODE_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: WebNodeComponent,
    children: [
      {
        path: 'peers',
        loadChildren: () => import('./web-node-peers/web-node-peers.module').then(module => module.WebNodePeersModule),
        title: WEB_NODE_TITLE,
      },
      {
        path: 'logs',
        loadChildren: () => import('./web-node-logs/web-node-logs.module').then(module => module.WebNodeLogsModule),
        title: WEB_NODE_TITLE,
      },
      {
        path: 'wallet',
        loadChildren: () => import('./web-node-wallet/web-node-wallet.module').then(module => module.WebNodeWalletModule),
        title: WEB_NODE_TITLE,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'wallet',
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'wallet',
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
export class WebNodeRouting {}
