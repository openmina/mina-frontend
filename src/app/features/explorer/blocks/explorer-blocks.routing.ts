import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerBlocksComponent } from '@explorer/blocks/explorer-blocks.component';

const routes: Routes = [
  {
    path: '',
    component: ExplorerBlocksComponent,
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
