import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EXPLORER_TITLE } from '@app/app.routing';
import { ExplorerComponent } from '@explorer/explorer.component';

const routes: Routes = [
  {
    path: '',
    component: ExplorerComponent,
    children: [
      {
        path: 'blocks',
        loadChildren: () => import('./blocks/explorer-blocks.module').then(m => m.ExplorerBlocksModule),
        title: EXPLORER_TITLE,
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/explorer-transactions.module').then(m => m.ExplorerTransactionsModule),
        title: EXPLORER_TITLE,
      },
      {
        path: 'snarks',
        loadChildren: () => import('./snarks/explorer-snarks.module').then(m => m.SnarksModule),
        title: EXPLORER_TITLE,
      },
      {
        path: 'scan-state',
        loadChildren: () => import('./scan-state/explorer-scan-state.module').then(m => m.ExplorerScanStateModule),
        title: EXPLORER_TITLE,
      },
      {
        path: '**',
        redirectTo: 'blocks',
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
  exports: [RouterModule]
})
export class ExplorerRouting { }
