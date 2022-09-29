import { NgModule } from '@angular/core';

import { NetworkComponent } from './network.component';
import { NetworkRouting } from '@app/features/network/network.routing';
import { EffectsModule } from '@ngrx/effects';
import { NetworkEffects } from '@network/network.effects';
import { SharedModule } from '@shared/shared.module';
import { NetworkFiltersComponent } from './network-filters/network-filters.component';
import { NetworkTableComponent } from './network-table/network-table.component';
import { NetworkSidePanelComponent } from './network-side-panel/network-side-panel.component';
import { NetworkTableFooterComponent } from './network-table-footer/network-table-footer.component';
import { NetworkIntervalSelectComponent } from './network-interval-select/network-interval-select.component';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    NetworkComponent,
    NetworkFiltersComponent,
    NetworkTableComponent,
    NetworkSidePanelComponent,
    NetworkTableFooterComponent,
    NetworkIntervalSelectComponent,
  ],
  imports: [
    NetworkRouting,
    SharedModule,
    EffectsModule.forFeature([NetworkEffects]),
  ],
  providers: [
    DatePipe,
  ]
})
export class NetworkModule {}
