import { NgModule } from '@angular/core';

import { ExplorerBlocksRouting } from './explorer-blocks.routing';
import { ExplorerBlocksComponent } from './explorer-blocks.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { ExplorerBlocksEffects } from '@explorer/blocks/explorer-blocks.effects';
import { ExplorerBlocksTableComponent } from '@explorer/blocks/explorer-blocks-table/explorer-blocks-table.component';


@NgModule({
  declarations: [
    ExplorerBlocksComponent,
    ExplorerBlocksTableComponent,
  ],
  imports: [
    SharedModule,
    ExplorerBlocksRouting,
    EffectsModule.forFeature([ExplorerBlocksEffects])
  ]
})
export class ExplorerBlocksModule { }

