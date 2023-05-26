import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZkAppRouting } from './zk-app.routing';
import { ZkAppComponent } from './zk-app.component';


@NgModule({
  declarations: [
    ZkAppComponent
  ],
  imports: [
    CommonModule,
    ZkAppRouting
  ]
})
export class ZkAppModule { }
