import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'system',
    loadChildren: () => import('./system/system-resources.module').then(module => module.SystemResourcesModule),
  },
  {
    path: '**',
    redirectTo: 'system',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourcesRouting {}
