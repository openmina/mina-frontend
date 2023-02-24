import { NgModule } from '@angular/core';

import { NetworkPropagationRouting } from './network-propagation.routing';
import { NetworkPropagationComponent } from './network-propagation.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    NetworkPropagationComponent,
  ],
  imports: [
    SharedModule,
    NetworkPropagationRouting,
  ],
})
export class NetworkPropagationModule {}
