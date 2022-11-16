import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebNodeStateComponent } from '@web-node/web-node-state/web-node-state.component';

const routes: Routes = [
  {
    path: '',
    component: WebNodeStateComponent,
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
export class WebNodeStateRouting {}
