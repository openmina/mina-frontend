import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebNodeDemoComponent } from '@app/features/web-node-demo/web-node-demo.component';
import { WebNodeDemoDashboardComponent } from '@app/features/web-node-demo/web-node-demo-dashboard/web-node-demo-dashboard.component';
import { WebNodeDemoCreateTransactionComponent } from '@app/features/web-node-demo/web-node-demo-create-transaction/web-node-demo-create-transaction.component';

const routes: Routes = [
  {
    path: '',
    component: WebNodeDemoComponent,
    children: [
      {
        path: '',
        component: WebNodeDemoDashboardComponent,
      },
      {
        path: 'create-transaction',
        component: WebNodeDemoCreateTransactionComponent,
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebNodeDemoRouting {}
