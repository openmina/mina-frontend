import { NgModule } from '@angular/core';

import { WebNodeLogsRouting } from './web-node-logs.routing';
import { WebNodeLogsComponent } from './web-node-logs.component';
import { SharedModule } from '@shared/shared.module';
import { WebNodeLogsTableComponent } from './web-node-logs-table/web-node-logs-table.component';
import { WebNodeLogsSidePanelComponent } from './web-node-logs-side-panel/web-node-logs-side-panel.component';
import { MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { CopyComponent } from '@shared/components/copy/copy.component';


@NgModule({
  declarations: [
    WebNodeLogsComponent,
    WebNodeLogsTableComponent,
    WebNodeLogsSidePanelComponent,
  ],
  imports: [
    WebNodeLogsRouting,
    MinaJsonViewerComponent,
    HorizontalResizableContainerOldComponent,
    SharedModule,
    CopyComponent,
  ],
})
export class WebNodeLogsModule {}
