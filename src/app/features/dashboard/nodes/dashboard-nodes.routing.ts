import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardNodesComponent } from '@dashboard/nodes/dashboard-nodes.component';
import { DASHBOARD_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: DashboardNodesComponent,
    children: [
      {
        path: ':height',
        component: DashboardNodesComponent,
        title: DASHBOARD_TITLE,
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
export class DashboardNodesRouting {}
