import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NETWORK_TITLE } from '@app/app.routing';
import { NetworkBlocksIpcComponent } from '@network/blocks-ipc/network-blocks-ipc.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkBlocksIpcComponent,
    children: [
      {
        path: ':height',
        component: NetworkBlocksIpcComponent,
        title: NETWORK_TITLE,
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
export class NetworkBlocksIpcRouting {}
