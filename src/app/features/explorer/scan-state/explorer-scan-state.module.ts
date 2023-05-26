import { NgModule } from '@angular/core';
import { ExplorerScanStateListComponent } from './explorer-scan-state-list/explorer-scan-state-list.component';
import { SharedModule } from '@shared/shared.module';
import { ExplorerScanStateRouting } from '@explorer/scan-state/explorer-scan-state.routing';
import { ExplorerScanStateComponent } from '@explorer/scan-state/explorer-scan-state.component';
import { EffectsModule } from '@ngrx/effects';
import { ExplorerScanStateEffects } from '@explorer/scan-state/explorer-scan-state.effects';
import { ExplorerScanStateToolbarComponent } from './explorer-scan-state-toolbar/explorer-scan-state-toolbar.component';
import { HorizontalMenuComponent } from '@shared/components/horizontal-menu/horizontal-menu.component';
import { ScanStateChartComponent } from './scan-state-chart/scan-state-chart.component';
import { ExplorerScanStateChartListComponent } from './explorer-scan-state-chart-list/explorer-scan-state-chart-list.component';


@NgModule({
  declarations: [
    ExplorerScanStateListComponent,
    ExplorerScanStateComponent,
    ExplorerScanStateToolbarComponent,
    ScanStateChartComponent,
    ExplorerScanStateChartListComponent,
  ],
  imports: [
    SharedModule,
    ExplorerScanStateRouting,
    EffectsModule.forFeature(ExplorerScanStateEffects),
    HorizontalMenuComponent,
  ],
})
export class ExplorerScanStateModule {}
