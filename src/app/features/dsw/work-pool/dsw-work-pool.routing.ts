import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DSW_TITLE } from '@app/app.routing';
import { DswWorkPoolComponent } from '@dsw/work-pool/dsw-work-pool.component';


const routes: Routes = [
  {
    path: '',
    component: DswWorkPoolComponent,
    children: [
      {
        path: ':id',
        component: DswWorkPoolComponent,
        title: DSW_TITLE,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DswWorkPoolRouting {}
