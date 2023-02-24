import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemResourcesComponent } from '@resources/system/system-resources.component';

const routes: Routes = [
  {
    path: '',
    component: SystemResourcesComponent,
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
export class SystemResourcesRouting {}
