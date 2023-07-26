import { NgModule } from '@angular/core';

import { DswLiveRouting } from './dsw-live.routing';
import { DswLiveComponent } from './dsw-live.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { DswLiveEffects } from '@dsw/live/dsw-live.effects';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { DswLiveToolbarComponent } from './dsw-live-toolbar/dsw-live-toolbar.component';
import { DswLiveFiltersComponent } from './dsw-live-filters/dsw-live-filters.component';
import { DswLiveBlocksMapComponent } from './dsw-live-blocks-map/dsw-live-blocks-map.component';
import { DswLiveEventsTableComponent } from './dsw-live-events-table/dsw-live-events-table.component';


@NgModule({
  declarations: [
    DswLiveComponent,
    DswLiveToolbarComponent,
    DswLiveFiltersComponent,
    DswLiveBlocksMapComponent,
    DswLiveEventsTableComponent,
  ],
  imports: [
    SharedModule,
    DswLiveRouting,
    EffectsModule.forFeature(DswLiveEffects),
    HorizontalResizableContainerComponent,
  ],
})
export class DswLiveModule {}
