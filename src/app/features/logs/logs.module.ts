import { NgModule } from '@angular/core';

import { LogsRouting } from './logs.routing';
import { LogsComponent } from './logs.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { LogsEffects } from '@logs/logs.effects';
import { LogsTableComponent } from './logs-table/logs-table.component';
import { LogsToolbarComponent } from './logs-toolbar/logs-toolbar.component';
import { LogsSidePanelComponent } from './logs-side-panel/logs-side-panel.component';


@NgModule({
  declarations: [
    LogsComponent,
    LogsTableComponent,
    LogsToolbarComponent,
    LogsSidePanelComponent,
  ],
  imports: [
    SharedModule,
    LogsRouting,
    EffectsModule.forFeature([LogsEffects]),
  ],
})
export class LogsModule {}
