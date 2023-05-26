import { NgModule } from '@angular/core';

import { StorageRouting } from './storage.routing';
import { StorageComponent } from './storage.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    StorageComponent
  ],
  imports: [
    SharedModule,
    StorageRouting
  ]
})
export class StorageModule { }
