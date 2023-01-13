import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BenchmarksComponent } from '@benchmarks/benchmarks.component';
import { BenchmarksWalletsComponent } from '@benchmarks/benchmarks-wallets/benchmarks-wallets.component';
import { BENCHMARKS_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: BenchmarksComponent,
    children: [
      {
        path: 'wallets',
        component: BenchmarksWalletsComponent,
        title: BENCHMARKS_TITLE,
      },
      {
        path: '**',
        redirectTo: 'wallets',
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenchmarksRouting {}
