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
import { MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { ExplorerBlocksZkAppsTableComponent } from './explorer-blocks-zk-apps-table/explorer-blocks-zk-apps-table.component';
import { ExplorerBlocksZkAppDetailComponent } from './explorer-blocks-zk-app-detail/explorer-blocks-zk-app-detail.component';
import { ExplorerBlocksUserCommandsComponent } from './explorer-blocks-user-commands/explorer-blocks-user-commands.component';


@NgModule({
  declarations: [
    ExplorerBlocksComponent,
    ExplorerBlocksTableComponent,
    ExplorerBlocksSidePanelComponent,
    ExplorerBlocksZkAppsTableComponent,
    ExplorerBlocksZkAppDetailComponent,
    ExplorerBlocksUserCommandsComponent,
  ],
  imports: [
    SharedModule,
    CopyComponent,
    ExplorerBlocksRouting,
    EffectsModule.forFeature(ExplorerBlocksEffects),
    HorizontalMenuComponent,
    MinaJsonViewerComponent,
    HorizontalResizableContainerComponent,
  ],
})
export class ExplorerBlocksModule { }

