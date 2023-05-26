import { NgModule } from '@angular/core';

import { DashboardNodesRouting } from './dashboard-nodes.routing';
import { DashboardNodesComponent } from './dashboard-nodes.component';
import { SharedModule } from '@shared/shared.module';
import { DashboardNodesTableComponent } from './dashboard-nodes-table/dashboard-nodes-table.component';
import { DashboardNodesToolbarComponent } from './dashboard-nodes-toolbar/dashboard-nodes-toolbar.component';
import { EffectsModule } from '@ngrx/effects';
import { DashboardNodesEffects } from '@dashboard/nodes/dashboard-nodes.effects';
import { DashboardNodesSidePanelComponent } from './dashboard-nodes-side-panel/dashboard-nodes-side-panel.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { CopyComponent } from '@shared/components/copy/copy.component';
import { HorizontalMenuComponent } from '@shared/components/horizontal-menu/horizontal-menu.component';


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
    HorizontalResizableContainerComponent,
    DashboardNodesRouting,
    EffectsModule.forFeature([DashboardNodesEffects]),
    HorizontalMenuComponent,
  ],
})
export class DashboardNodesModule {}
