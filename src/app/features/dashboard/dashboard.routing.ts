import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DASHBOARD_TITLE } from '@app/app.routing';
import { DashboardComponent } from '@dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'nodes',
        loadChildren: () => import('./nodes/dashboard-nodes.module').then(m => m.DashboardNodesModule),
        title: DASHBOARD_TITLE,
      },
      {
        path: 'topology',
        loadChildren: () => import('./splits/dashboard-splits.module').then(m => m.DashboardSplitsModule),
        title: DASHBOARD_TITLE,
      },
      {
        path: '**',
        redirectTo: 'nodes',
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
export class DashboardRouting {}
