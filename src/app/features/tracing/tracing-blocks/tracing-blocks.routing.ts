import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_TITLE } from '@app/app.routing';
import { TracingBlocksComponent } from '@tracing/tracing-blocks/tracing-blocks.component';

const routes: Routes = [
  {
    path: '',
    component: TracingBlocksComponent,
    children: [
      {
        path: ':hash',
        component: TracingBlocksComponent,
        title: APP_TITLE + ' - Tracing',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TracingBlocksRouting {}
