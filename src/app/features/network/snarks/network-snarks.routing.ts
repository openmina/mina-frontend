import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkSnarksComponent } from '@network/snarks/network-snarks.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkSnarksComponent,
    children: [

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkSnarksRouting {}
