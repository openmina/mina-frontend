import { NgModule } from '@angular/core';

import { ExplorerSnarksTableComponent } from './explorer-snarks-table/explorer-snarks-table.component';
import { SharedModule } from '@shared/shared.module';
import { ExplorerSnarksComponent } from '@explorer/snarks/explorer-snarks.component';
import { ExplorerSnarksRouting } from '@explorer/snarks/explorer-snarks.routing';
import { CopyComponent } from '@shared/components/copy/copy.component';


@NgModule({
  declarations: [
    ExplorerSnarksComponent,
    ExplorerSnarksTableComponent,
  ],
  imports: [
    SharedModule,
    CopyComponent,
    ExplorerSnarksRouting,
  ],
})
export class SnarksModule {}
