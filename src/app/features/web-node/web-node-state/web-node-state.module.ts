import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebNodeStateRouting } from './web-node-state.routing';
import { WebNodeStateComponent } from './web-node-state.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    WebNodeStateComponent
  ],
  imports: [
    CommonModule,
    WebNodeStateRouting,
    SharedModule,
  ],
})
export class WebNodeStateModule { }
