import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DswComponent } from '@dsw/dsw.component';
import { DSW_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: DswComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dsw-dashboard.module').then(m => m.DswDashboardModule),
        title: DSW_TITLE,
      },
      {
        path: 'actions',
        loadChildren: () => import('./actions/dsw-actions.module').then(m => m.DswActionsModule),
        title: DSW_TITLE,
      },
      {
        path: '**',
        redirectTo: 'actions',
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
export class DswRouting {}
