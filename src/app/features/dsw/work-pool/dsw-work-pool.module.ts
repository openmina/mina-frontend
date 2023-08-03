import { NgModule } from '@angular/core';

import { DswWorkPoolRouting } from './dsw-work-pool.routing';
import { DswWorkPoolComponent } from './dsw-work-pool.component';
import { DswWorkPoolTableComponent } from './dsw-work-pool-table/dsw-work-pool-table.component';
import { DswWorkPoolSidePanelComponent } from './dsw-work-pool-side-panel/dsw-work-pool-side-panel.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { DswWorkPoolEffects } from '@dsw/work-pool/dsw-work-pool.effects';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { CopyComponent } from '@shared/components/copy/copy.component';
import { MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { DswWorkPoolToolbarComponent } from './dsw-work-pool-toolbar/dsw-work-pool-toolbar.component';
import { DswWorkPoolStatisticsComponent } from './dsw-work-pool-statistics/dsw-work-pool-statistics.component';
import { HorizontalMenuComponent } from '@shared/components/horizontal-menu/horizontal-menu.component';
import { DswWorkPoolDetailsComponent } from './dsw-work-pool-details/dsw-work-pool-details.component';
import { DswWorkPoolDetailsOverviewComponent } from './dsw-work-pool-details-overview/dsw-work-pool-details-overview.component';
import { DswWorkPoolDetailsSpecsComponent } from './dsw-work-pool-details-specs/dsw-work-pool-details-specs.component';
import { DswWorkPoolDetailsAccountsComponent } from './dsw-work-pool-details-accounts/dsw-work-pool-details-accounts.component';


@NgModule({
  declarations: [
    DswWorkPoolComponent,
    DswWorkPoolTableComponent,
    DswWorkPoolSidePanelComponent,
    DswWorkPoolToolbarComponent,
    DswWorkPoolStatisticsComponent,
    DswWorkPoolDetailsComponent,
    DswWorkPoolDetailsOverviewComponent,
    DswWorkPoolDetailsSpecsComponent,
    DswWorkPoolDetailsAccountsComponent,
  ],
  imports: [
    DswWorkPoolRouting,
    SharedModule,
    EffectsModule.forFeature(DswWorkPoolEffects),
    HorizontalResizableContainerComponent,
    CopyComponent,
    MinaJsonViewerComponent,
    HorizontalMenuComponent,
  ],
})
export class DswWorkPoolModule {}
