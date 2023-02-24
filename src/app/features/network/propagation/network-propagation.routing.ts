import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkPropagationComponent } from '@network/propagation/network-propagation.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkPropagationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkPropagationRouting {}
