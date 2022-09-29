import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TracingComponent } from '@app/features/tracing/tracing.component';
import { APP_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: TracingComponent,
    children: [
      {
        path: 'blocks',
        loadChildren: () => import('./tracing-blocks/tracing-blocks.module').then(m => m.TracingBlocksModule),
        title: APP_TITLE + ' - Tracing',
      },
      {
        path: 'overview',
        loadChildren: () => import('./tracing-overview/tracing-overview.module').then(m => m.TracingOverviewModule),
        title: APP_TITLE + ' - Tracing',
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TracingRouting {}
