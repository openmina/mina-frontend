import { NgModule } from '@angular/core';

import { ExplorerBlocksRouting } from './explorer-blocks.routing';
import { ExplorerBlocksComponent } from './explorer-blocks.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { ExplorerBlocksEffects } from '@explorer/blocks/explorer-blocks.effects';
import { ExplorerBlocksTableComponent } from '@explorer/blocks/explorer-blocks-table/explorer-blocks-table.component';
import { CopyComponent } from '@shared/components/copy/copy.component';
import { HorizontalMenuComponent } from '@app/shared/components/horizontal-menu/horizontal-menu.component';
import { ExplorerBlocksSidePanelComponent } from './explorer-blocks-side-panel/explorer-blocks-side-panel.component';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';


@NgModule({
  declarations: [
    ExplorerBlocksComponent,
    ExplorerBlocksTableComponent,
    ExplorerBlocksSidePanelComponent,
  ],
  imports: [
    SharedModule,
    CopyComponent,
    ExplorerBlocksRouting,
    EffectsModule.forFeature(ExplorerBlocksEffects),
    HorizontalMenuComponent,
    HorizontalResizableContainerOldComponent,
    MinaJsonViewerComponent,
    HorizontalResizableContainerComponent,
  ],
})
export class ExplorerBlocksModule { }

