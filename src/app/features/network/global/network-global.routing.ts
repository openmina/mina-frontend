import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkGlobalComponent } from '@network/global/network-global.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkGlobalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkGlobalRouting { }
