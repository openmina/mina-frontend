import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerScanStateComponent } from '@explorer/scan-state/explorer-scan-state.component';
import { EXPLORER_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: ExplorerScanStateComponent,
    children: [
      {
        path: ':height',
        component: ExplorerScanStateComponent,
        title: EXPLORER_TITLE,
      },
    ],
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
export class ExplorerScanStateRouting {}
