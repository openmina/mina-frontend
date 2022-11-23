import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FeatureGuard } from '@shared/guards/feature.guard';

const APP_TITLE: string = 'Open Mina';

export const RESOURCES_TITLE: string = APP_TITLE + ' - Resources';
export const NETWORK_TITLE: string = APP_TITLE + ' - Network';
export const TRACING_TITLE: string = APP_TITLE + ' - Tracing';
export const WEB_NODE_TITLE: string = APP_TITLE + ' - Web Node';
export const STRESSING_TITLE: string = APP_TITLE + ' - Stressing';

export const routes: Routes = [
  {
    path: 'resources',
    loadChildren: () => import('./features/resources/resources.module').then(module => module.ResourcesModule),
    title: RESOURCES_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'network',
    loadChildren: () => import('./features/network/network.module').then(module => module.NetworkModule),
    title: NETWORK_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'tracing',
    loadChildren: () => import('./features/tracing/tracing.module').then(module => module.TracingModule),
    title: TRACING_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'web-node',
    loadChildren: () => import('./features/web-node/web-node.module').then(module => module.WebNodeModule),
    title: WEB_NODE_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'stressing',
    loadChildren: () => import('./features/stressing/stressing.module').then(module => module.StressingModule),
    title: STRESSING_TITLE,
    canActivate: [FeatureGuard],
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
