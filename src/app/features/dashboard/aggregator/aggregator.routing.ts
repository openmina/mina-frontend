import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AggregatorComponent } from '@dashboard/aggregator/aggregator.component';
import { DASHBOARD_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: AggregatorComponent,
    children: [
      {
        path: ':height',
        component: AggregatorComponent,
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
export class AggregatorRouting {}
