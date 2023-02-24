import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SnarkWorkersTracesComponent } from '@explorer/snark-workers-traces/snark-workers-traces.component';
import { EXPLORER_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: SnarkWorkersTracesComponent,
    children: [
      {
        path: ':id',
        component: SnarkWorkersTracesComponent,
        title: EXPLORER_TITLE,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SnarkWorkersTracesRouting {}
