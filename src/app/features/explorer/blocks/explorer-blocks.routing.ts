import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerBlocksComponent } from '@explorer/blocks/explorer-blocks.component';
import { EXPLORER_TITLE } from '@app/app.routing';

const routes: Routes = [
  {
    path: '',
    component: ExplorerBlocksComponent,
    children: [
      {
        path: ':hash',
        component: ExplorerBlocksComponent,
        title: EXPLORER_TITLE,
      }
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
  exports: [RouterModule]
})
export class ExplorerBlocksRouting { }
