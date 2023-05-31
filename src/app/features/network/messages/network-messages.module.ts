import { NgModule } from '@angular/core';

import { NetworkMessagesComponent } from './network-messages.component';
import { NetworkMessagesRouting } from '@network/messages/network-messages.routing';
import { EffectsModule } from '@ngrx/effects';
import { NetworkMessagesEffects } from '@network/messages/network-messages.effects';
import { SharedModule } from '@shared/shared.module';
import { NetworkMessagesFiltersComponent } from './network-messages-filters/network-messages-filters.component';
import { NetworkMessagesTableComponent } from './network-messages-table/network-messages-table.component';
import { NetworkMessagesSidePanelComponent } from './network-messages-side-panel/network-messages-side-panel.component';
import { NetworkMessagesTableFooterComponent } from './network-messages-table-footer/network-messages-table-footer.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';


@NgModule({
  declarations: [
    NetworkMessagesComponent,
    NetworkMessagesFiltersComponent,
    NetworkMessagesTableComponent,
    NetworkMessagesSidePanelComponent,
    NetworkMessagesTableFooterComponent,
  ],
  imports: [
    NetworkMessagesRouting,
    SharedModule,
    MinaJsonViewerComponent,
    HorizontalResizableContainerOldComponent,
    CommonModule,
    EffectsModule.forFeature([NetworkMessagesEffects]),
  ],
  providers: [
    DatePipe,
  ]
})
export class NetworkMessagesModule {}
