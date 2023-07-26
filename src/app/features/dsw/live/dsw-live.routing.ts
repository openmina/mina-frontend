import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DSW_TITLE } from '@app/app.routing';
import { DswLiveComponent } from '@dsw/live/dsw-live.component';

const routes: Routes = [
  {
    path: '',
    component: DswLiveComponent,
    children: [
      {
        path: ':bestTip',
        component: DswLiveComponent,
        title: DSW_TITLE,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DswLiveRouting {}
