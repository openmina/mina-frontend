import { NgModule } from '@angular/core';

import { ExplorerSnarksTableComponent } from './explorer-snarks-table/explorer-snarks-table.component';
import { SharedModule } from '@shared/shared.module';
import { ExplorerSnarksComponent } from '@explorer/snarks/explorer-snarks.component';
import { ExplorerSnarksRouting } from '@explorer/snarks/explorer-snarks.routing';


@NgModule({
  declarations: [
    ExplorerSnarksComponent,
    ExplorerSnarksTableComponent,
  ],
  imports: [
    SharedModule,
    ExplorerSnarksRouting,
  ],
})
export class SnarksModule {}
