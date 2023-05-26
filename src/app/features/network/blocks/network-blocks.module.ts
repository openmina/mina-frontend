import { NgModule } from '@angular/core';

import { NetworkBlocksRouting } from './network-blocks.routing';
import { SharedModule } from '@shared/shared.module';
import { NetworkBlocksComponent } from '@network/blocks/network-blocks.component';
import { NetworkBlocksTableComponent } from './network-blocks-table/network-blocks-table.component';
import { NetworkBlocksGraphComponent } from './network-blocks-graph/network-blocks-graph.component';
import { EffectsModule } from '@ngrx/effects';
import { NetworkBlocksEffects } from '@network/blocks/network-blocks.effects';
import { NetworkBlocksSidePanelComponent } from './network-blocks-side-panel/network-blocks-side-panel.component';
import { NetworkBlocksToolbarComponent } from './network-blocks-toolbar/network-blocks-toolbar.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { CopyComponent } from '@shared/components/copy/copy.component';


@NgModule({
  declarations: [
    NetworkBlocksComponent,
    NetworkBlocksTableComponent,
    NetworkBlocksGraphComponent,
    NetworkBlocksSidePanelComponent,
    NetworkBlocksToolbarComponent,
  ],
  imports: [
    SharedModule,
    CopyComponent,
    HorizontalResizableContainerComponent,
    NetworkBlocksRouting,
    EffectsModule.forFeature([NetworkBlocksEffects]),
  ],
  exports: [
    NetworkBlocksGraphComponent,
  ],
})
export class NetworkBlocksModule {}
