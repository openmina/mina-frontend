import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuzzingComponent } from '@fuzzing/fuzzing.component';
import { FUZZING_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: 'ocaml',
    component: FuzzingComponent,
    children: [
      {
        path: ':file',
        component: FuzzingComponent,
        title: FUZZING_TITLE,
      },
    ],
  },
  {
    path: 'rust',
    component: FuzzingComponent,
    children: [
      {
        path: ':file',
        component: FuzzingComponent,
        title: FUZZING_TITLE,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'ocaml',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuzzingRouting {}
