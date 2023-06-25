import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DSW_TITLE } from '@app/app.routing';
import { DswFrontierComponent } from '@dsw/frontier/dsw-frontier.component';

const routes: Routes = [
  {
    path: '',
    component: DswFrontierComponent,
    children: [
      {
        path: ':log',
        component: DswFrontierComponent,
        title: DSW_TITLE,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DswFrontierRouting {}
