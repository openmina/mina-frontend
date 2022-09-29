import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'system',
    loadChildren: () => import('./system-resources/system-resources.module').then(module => module.SystemResourcesModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'system',
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
export class ResourcesRouting {}
