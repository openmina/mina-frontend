import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkBlocksComponent } from '@network/blocks/network-blocks.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkBlocksComponent,
    children: [],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkBlocksRouting { }
