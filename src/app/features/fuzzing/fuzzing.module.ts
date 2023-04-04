import { NgModule } from '@angular/core';

import { FuzzingComponent } from './fuzzing.component';
import { FuzzingTableComponent } from './fuzzing-table/fuzzing-table.component';
import { FuzzingCodeComponent } from './fuzzing-code/fuzzing-code.component';
import { FuzzingRouting } from '@fuzzing/fuzzing.routing';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { FuzzingEffects } from '@fuzzing/fuzzing.effects';
import { FuzzingToolbarComponent } from './fuzzing-toolbar/fuzzing-toolbar.component';


@NgModule({
  declarations: [
    FuzzingComponent,
    FuzzingTableComponent,
    FuzzingCodeComponent,
    FuzzingToolbarComponent,
  ],
  imports: [
    SharedModule,
    FuzzingRouting,
    EffectsModule.forFeature([FuzzingEffects]),
  ],
})
export class FuzzingModule {}
