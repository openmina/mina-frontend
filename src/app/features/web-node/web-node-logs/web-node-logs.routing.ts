import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebNodeLogsComponent } from '@web-node/web-node-logs/web-node-logs.component';
import { WEB_NODE_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: WebNodeLogsComponent,
    children: [
      {
        path: ':id',
        component: WebNodeLogsComponent,
        title: WEB_NODE_TITLE,
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebNodeLogsRouting {}
