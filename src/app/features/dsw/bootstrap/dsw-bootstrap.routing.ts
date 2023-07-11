import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DSW_TITLE } from '@app/app.routing';
import { DswBootstrapComponent } from '@dsw/bootstrap/dsw-bootstrap.component';

const routes: Routes = [
  {
    path: '',
    component: DswBootstrapComponent,
    children: [
      {
        path: ':block',
        component: DswBootstrapComponent,
        title: DSW_TITLE,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DswBootstrapRouting {}
