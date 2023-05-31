import { NgModule } from '@angular/core';

import { DashboardNodesRouting } from './dashboard-nodes.routing';
import { DashboardNodesComponent } from './dashboard-nodes.component';
import { SharedModule } from '@shared/shared.module';
import { DashboardNodesTableComponent } from './dashboard-nodes-table/dashboard-nodes-table.component';
import { DashboardNodesToolbarComponent } from './dashboard-nodes-toolbar/dashboard-nodes-toolbar.component';
import { EffectsModule } from '@ngrx/effects';
import { DashboardNodesEffects } from '@dashboard/nodes/dashboard-nodes.effects';
import { DashboardNodesSidePanelComponent } from './dashboard-nodes-side-panel/dashboard-nodes-side-panel.component';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { CopyComponent } from '@shared/components/copy/copy.component';
import { HorizontalMenuComponent } from '@shared/components/horizontal-menu/horizontal-menu.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';


@NgModule({
  declarations: [
    DashboardNodesComponent,
    DashboardNodesTableComponent,
    DashboardNodesToolbarComponent,
    DashboardNodesSidePanelComponent,
  ],
  imports: [
    SharedModule,
    CopyComponent,
    HorizontalResizableContainerOldComponent,
    DashboardNodesRouting,
    EffectsModule.forFeature([DashboardNodesEffects]),
    HorizontalMenuComponent,
    HorizontalResizableContainerComponent,
  ],
})
export class DashboardNodesModule {}
