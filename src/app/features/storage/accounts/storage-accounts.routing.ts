import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorageAccountsComponent } from '@app/features/storage/accounts/storage-accounts.component';

const routes: Routes = [
  {
    path: '',
    component: StorageAccountsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageAccountsRouting { }
