import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerSnarksComponent } from '@explorer/snarks/explorer-snarks.component';
import { EXPLORER_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: ExplorerSnarksComponent,
    children: [
      {
        path: ':workIds',
        component: ExplorerSnarksComponent,
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
export class ExplorerSnarksRouting {}
