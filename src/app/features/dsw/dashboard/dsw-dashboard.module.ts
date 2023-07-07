import { NgModule } from '@angular/core';

import { DswDashboardRouting } from './dsw-dashboard.routing';
import { DswDashboardComponent } from './dsw-dashboard.component';
import { DswDashboardTableComponent } from './dsw-dashboard-table/dsw-dashboard-table.component';
import { DswDashboardSidePanelComponent } from './dsw-dashboard-side-panel/dsw-dashboard-side-panel.component';
import { DswDashboardToolbarComponent } from './dsw-dashboard-toolbar/dsw-dashboard-toolbar.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { DswDashboardEffects } from '@dsw/dashboard/dsw-dashboard.effects';
import { HorizontalMenuComponent } from '@shared/components/horizontal-menu/horizontal-menu.component';
import { CopyComponent } from '@shared/components/copy/copy.component';


@NgModule({
  declarations: [
    DswDashboardComponent,
    DswDashboardTableComponent,
    DswDashboardSidePanelComponent,
    DswDashboardToolbarComponent,
  ],
  imports: [
    SharedModule,
    DswDashboardRouting,
    HorizontalResizableContainerComponent,
    EffectsModule.forFeature(DswDashboardEffects),
    HorizontalMenuComponent,
    CopyComponent,
  ],
})
export class DswDashboardModule {}
