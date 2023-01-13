import { NgModule } from '@angular/core';
import { BenchmarksComponent } from './benchmarks.component';
import { SharedModule } from '@shared/shared.module';
import { BenchmarksRouting } from '@benchmarks/benchmarks.routing';
import { BenchmarksWalletsComponent } from './benchmarks-wallets/benchmarks-wallets.component';
import { EffectsModule } from '@ngrx/effects';
import { BenchmarksEffects } from '@benchmarks/benchmarks.effects';
import { BenchmarksToolbarComponent } from './benchmarks-toolbar/benchmarks-toolbar.component';


@NgModule({
  declarations: [
    BenchmarksComponent,
    BenchmarksWalletsComponent,
    BenchmarksToolbarComponent,
  ],
  imports: [
    SharedModule,
    BenchmarksRouting,
    EffectsModule.forFeature([BenchmarksEffects]),
  ],
})
export class BenchmarksModule {}
