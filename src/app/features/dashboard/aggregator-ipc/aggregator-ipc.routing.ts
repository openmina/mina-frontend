import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DASHBOARD_TITLE } from '@app/app.routing';
import { AggregatorIpcComponent } from '@dashboard/aggregator-ipc/aggregator-ipc.component';

const routes: Routes = [
  {
    path: '',
    component: AggregatorIpcComponent,
    children: [
      {
        path: ':height',
        component: AggregatorIpcComponent,
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
export class AggregatorIpcRouting {}
