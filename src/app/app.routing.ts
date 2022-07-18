import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemingTestingComponent } from './theming-testing/theming-testing.component';
import { AccountListComponent } from './account-list/account-list.component';

const routes: Routes = [
  {
    path: 'theming',
    component: ThemingTestingComponent,
  },
  {
    path: 'accounts',
    component: AccountListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouting { }
