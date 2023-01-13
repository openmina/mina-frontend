import { NgModule } from '@angular/core';
import { ExplorerComponent } from './explorer.component';
import { SharedModule } from '@shared/shared.module';
import { ExplorerRouting } from '@explorer/explorer.routing';
import { EffectsModule } from '@ngrx/effects';
import { ExplorerSnarksEffects } from '@explorer/snarks/explorer-snarks.effects';


@NgModule({
  declarations: [
    ExplorerComponent,
  ],
  imports: [
    SharedModule,
    ExplorerRouting,
    EffectsModule.forFeature([ExplorerSnarksEffects]),
  ],
})
export class ExplorerModule {}
