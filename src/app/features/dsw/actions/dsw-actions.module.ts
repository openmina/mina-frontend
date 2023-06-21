import { NgModule } from '@angular/core';

import { DswActionsRouting } from './dsw-actions.routing';
import { DswActionsComponent } from './dsw-actions.component';
import { DswActionsToolbarComponent } from './dsw-actions-toolbar/dsw-actions-toolbar.component';
import { DswActionsSidePanelComponent } from './dsw-actions-side-panel/dsw-actions-side-panel.component';
import { DswActionsGraphListComponent } from './dsw-actions-graph-list/dsw-actions-graph-list.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { DswActionsEffects } from '@dsw/actions/dsw-actions.effects';
import { FlameTimeGraphComponent } from '@shared/components/flame-time-graph/flame-time-graph/flame-time-graph.component';
import { HorizontalMenuComponent } from '@shared/components/horizontal-menu/horizontal-menu.component';
import { CopyComponent } from '@shared/components/copy/copy.component';


@NgModule({
  declarations: [
    DswActionsComponent,
    DswActionsToolbarComponent,
    DswActionsSidePanelComponent,
    DswActionsGraphListComponent,
  ],
  imports: [
    SharedModule,
    DswActionsRouting,
    HorizontalResizableContainerComponent,
    EffectsModule.forFeature(DswActionsEffects),
    FlameTimeGraphComponent,
    HorizontalMenuComponent,
    CopyComponent,
  ],
})
export class DswActionsModule {}
