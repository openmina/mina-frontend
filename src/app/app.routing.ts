import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const APP_TITLE = 'Open Mina';
const routes: Routes = [
  // {
  //   path: 'resources',
  //   loadChildren: () => import('./features/resources/resources.module').then(module => module.ResourcesModule),
  //   title: APP_TITLE + ' - Resources',
  // },
  {
    path: 'network',
    loadChildren: () => import('./features/network/network.module').then(module => module.NetworkModule),
    title: APP_TITLE + ' - Network',
  },
  {
    path: 'tracing',
    loadChildren: () => import('./features/tracing/tracing.module').then(module => module.TracingModule),
    title: APP_TITLE + ' - Tracing',
  },
  {
    path: '',
    redirectTo: 'network',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'network',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
      onSameUrlNavigation: 'ignore',
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRouting {}
