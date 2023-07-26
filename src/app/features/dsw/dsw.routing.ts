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
        path: 'bootstrap',
        loadChildren: () => import('./bootstrap/dsw-bootstrap.module').then(m => m.DswBootstrapModule),
        title: DSW_TITLE,
      },
      {
        path: 'actions',
        loadChildren: () => import('./actions/dsw-actions.module').then(m => m.DswActionsModule),
        title: DSW_TITLE,
      },
      {
        path: 'frontier',
        loadChildren: () => import('./frontier/dsw-frontier.module').then(m => m.DswFrontierModule),
        title: DSW_TITLE,
      },
      {
        path: 'live',
        loadChildren: () => import('./live/dsw-live.module').then(m => m.DswLiveModule),
        title: DSW_TITLE,
      },
      {
        path: '**',
        redirectTo: 'dashboard',
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
