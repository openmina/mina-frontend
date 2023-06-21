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
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { HorizontalMenuComponent } from '@shared/components/horizontal-menu/horizontal-menu.component';


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
    CommonModule,
    EffectsModule.forFeature([NetworkMessagesEffects]),
    HorizontalResizableContainerComponent,
    HorizontalMenuComponent,
  ],
  providers: [
    DatePipe,
  ]
})
export class NetworkMessagesModule {}
