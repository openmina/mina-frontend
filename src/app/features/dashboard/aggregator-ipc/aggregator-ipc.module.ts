import { NgModule } from '@angular/core';

import { AggregatorIpcComponent } from './aggregator-ipc.component';
import { AggregatorIpcRouting } from '@dashboard/aggregator-ipc/aggregator-ipc.routing';
import { SharedModule } from '@shared/shared.module';
import { AggregatorIpcTableComponent } from './aggregator-ipc-table/aggregator-ipc-table.component';
import { AggregatorIpcToolbarComponent } from './aggregator-ipc-toolbar/aggregator-ipc-toolbar.component';
import { EffectsModule } from '@ngrx/effects';
import { AggregatorIpcEffects } from '@dashboard/aggregator-ipc/aggregator-ipc.effects';


@NgModule({
  declarations: [
    AggregatorIpcComponent,
    AggregatorIpcTableComponent,
    AggregatorIpcToolbarComponent,
  ],
  imports: [
    SharedModule,
    AggregatorIpcRouting,
    EffectsModule.forFeature([AggregatorIpcEffects]),
  ],
})
export class AggregatorIpcModule {}
