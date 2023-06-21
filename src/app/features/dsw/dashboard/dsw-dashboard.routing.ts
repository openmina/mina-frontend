import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DswDashboardComponent } from '@dsw/dashboard/dsw-dashboard.component';
import { DSW_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: DswDashboardComponent,
    children: [
      {
        path: ':node',
        component: DswDashboardComponent,
        title: DSW_TITLE,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DswDashboardRouting {}
