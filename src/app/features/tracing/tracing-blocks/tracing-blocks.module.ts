import { NgModule } from '@angular/core';

import { TracingBlocksRouting } from './tracing-blocks.routing';
import { TracingBlocksComponent } from './tracing-blocks.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { TracingBlocksEffects } from '@tracing/tracing-blocks/tracing-blocks.effects';
import { TracingBlocksTableComponent } from '@tracing/tracing-blocks/tracing-blocks-table/tracing-blocks-table.component';
import { TracingBlocksSidePanelComponent } from '@tracing/tracing-blocks/tracing-blocks-side-panel/tracing-blocks-side-panel.component';
import { MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { CopyComponent } from '@shared/components/copy/copy.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';


@NgModule({
  declarations: [
    TracingBlocksComponent,
    TracingBlocksTableComponent,
    TracingBlocksSidePanelComponent,
  ],
  imports: [
    SharedModule,
    CopyComponent,
    MinaJsonViewerComponent,
    EffectsModule.forFeature([TracingBlocksEffects]),
    TracingBlocksRouting,
    HorizontalResizableContainerComponent,
  ],
})
export class TracingBlocksModule {}
