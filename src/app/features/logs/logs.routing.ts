import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from '@app/features/logs/logs.component';

const routes: Routes = [
  {
    path: '',
    component: LogsComponent,
    children: [
      {
        path: ':timestamp',
        component: LogsComponent,
      }
    ]
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
export class LogsRouting { }
