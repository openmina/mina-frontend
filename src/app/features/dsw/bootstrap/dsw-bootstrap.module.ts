import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DswBootstrapRouting } from './dsw-bootstrap.routing';
import { DswBootstrapComponent } from './dsw-bootstrap.component';
import { DswBootstrapTableComponent } from './dsw-bootstrap-table/dsw-bootstrap-table.component';
import { DswBootstrapSidePanelComponent } from './dsw-bootstrap-side-panel/dsw-bootstrap-side-panel.component';


@NgModule({
  declarations: [
    DswBootstrapComponent,
    DswBootstrapTableComponent,
    DswBootstrapSidePanelComponent,
  ],
  imports: [
    CommonModule,
    DswBootstrapRouting,
  ],
})
export class DswBootstrapModule {}
