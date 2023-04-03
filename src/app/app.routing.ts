import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { getFirstFeature } from '@shared/constants/config';
import { FeatureGuard } from '@core/guards/feature.guard';

const APP_TITLE: string = 'Open Mina';

export const RESOURCES_TITLE: string = APP_TITLE + ' - Resources';
export const NETWORK_TITLE: string = APP_TITLE + ' - Network';
export const TRACING_TITLE: string = APP_TITLE + ' - Tracing';
export const WEB_NODE_TITLE: string = APP_TITLE + ' - Web Node';
export const BENCHMARKS_TITLE: string = APP_TITLE + ' - Benchmarks';
export const DASHBOARD_TITLE: string = APP_TITLE + ' - Dashboard';
export const EXPLORER_TITLE: string = APP_TITLE + ' - Explorer';
export const LOGS_TITLE: string = APP_TITLE + ' - Logs';
export const FUZZING_TITLE: string = APP_TITLE + ' - Fuzzing';


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
    path: 'benchmarks',
    loadChildren: () => import('@benchmarks/benchmarks.module').then(module => module.BenchmarksModule),
    title: BENCHMARKS_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('@dashboard/dashboard.module').then(m => m.DashboardModule),
    title: DASHBOARD_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'explorer',
    loadChildren: () => import('@explorer/explorer.module').then(m => m.ExplorerModule),
    title: EXPLORER_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'logs',
    loadChildren: () => import('@logs/logs.module').then(m => m.LogsModule),
    title: LOGS_TITLE,
    canActivate: [FeatureGuard],
  },
  {
    path: 'fuzzing',
    loadChildren: () => import('@fuzzing/fuzzing.module').then(m => m.FuzzingModule),
    title: FUZZING_TITLE,
    // canActivate: [FeatureGuard],
  },
  {
    path: '**',
    redirectTo: getFirstFeature(),
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true,
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
      onSameUrlNavigation: 'ignore',
      initialNavigation: 'enabledNonBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRouting {}
