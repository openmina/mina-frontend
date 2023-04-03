import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuzzingComponent } from '@fuzzing/fuzzing.component';

const routes: Routes = [
  {
    path: '',
    component: FuzzingComponent,
    children: [
      {
        path: ':file',
        component: FuzzingComponent,
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
export class FuzzingRouting {}
