import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZkAppComponent } from '@app/features/zk-app/zk-app.component';

const routes: Routes = [
  {
    path: '',
    component: ZkAppComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZkAppRouting {}
