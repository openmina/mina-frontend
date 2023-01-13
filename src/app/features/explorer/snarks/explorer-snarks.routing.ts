import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerSnarksComponent } from '@explorer/snarks/explorer-snarks.component';

const routes: Routes = [
  {
    path: '',
    component: ExplorerSnarksComponent,
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
