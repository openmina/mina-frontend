import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkComponent } from '@app/features/network/network.component';
import { APP_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: NetworkComponent,
    children: [
      {
        path: ':messageId',
        component: NetworkComponent,
        title: APP_TITLE + ' - Network',
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
export class NetworkRouting {}
