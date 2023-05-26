import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'accounts',
    loadChildren: () => import('@storage/accounts/storage-accounts.module').then(m => m.StorageAccountsModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'accounts',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorageRouting {}
