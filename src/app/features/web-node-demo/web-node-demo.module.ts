import { NgModule } from '@angular/core';

import { WebNodeDemoRouting } from './web-node-demo.routing';
import { WebNodeDemoComponent } from './web-node-demo.component';
import { WebNodeDemoActiveWebNodeComponent } from './web-node-demo-active-web-node/web-node-demo-active-web-node.component';
import { WebNodeDemoWalletComponent } from './web-node-demo-wallet/web-node-demo-wallet.component';
import { WebNodeDemoTransactionComponent } from './web-node-demo-transaction/web-node-demo-transaction.component';
import { WebNodeDemoCreateTransactionComponent } from './web-node-demo-create-transaction/web-node-demo-create-transaction.component';
import { SharedModule } from '@shared/shared.module';
import { WebNodeDemoDashboardComponent } from './web-node-demo-dashboard/web-node-demo-dashboard.component';


@NgModule({
  declarations: [
    WebNodeDemoComponent,
    WebNodeDemoActiveWebNodeComponent,
    WebNodeDemoWalletComponent,
    WebNodeDemoTransactionComponent,
    WebNodeDemoCreateTransactionComponent,
    WebNodeDemoDashboardComponent
  ],
  imports: [
    WebNodeDemoRouting,
    SharedModule,
  ],
})
export class WebNodeDemoModule { }
