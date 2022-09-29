import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TracingOverviewComponent } from '@tracing/tracing-overview/tracing-overview.component';

const routes: Routes = [
  {
    path: '',
    component: TracingOverviewComponent,
  },
  {
    path: ':checkpoint',
    component: TracingOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TracingOverviewRouting {}
