import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { WebNodeDemoService } from '@app/features/web-node-demo/web-node-demo.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-demo-dashboard',
  templateUrl: './web-node-demo-dashboard.component.html',
  styleUrls: ['./web-node-demo-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebNodeDemoDashboardComponent extends ManualDetection implements OnInit {

  wallet: any;
  transaction: any;
  loading: any[];
  remaining: number;
  funding: boolean;

  constructor(private webNodeDemoService: WebNodeDemoService) { super(); }

  ngOnInit(): void {
    this.listenToWebNodeLoading();
    this.listenToWalletChange();
    this.listenToTxChange();

    if (this.transaction?.status === 'pending') {
      setTimeout(() => {
        this.webNodeDemoService.includeTransaction();
      }, 5000);
    }
  }

  private listenToWebNodeLoading(): void {
    this.webNodeDemoService.loadingWebNode$
      .pipe(untilDestroyed(this))
      .subscribe(loading => {
        this.loading = loading;
        this.detect();
      });
    this.webNodeDemoService.remainingUntilLoaded$
      .pipe(untilDestroyed(this))
      .subscribe(remaining => {
        this.remaining = remaining;
        this.detect();
      });
  }

  private listenToTxChange(): void {
    this.webNodeDemoService.transaction$
      .pipe(untilDestroyed(this))
      .subscribe(transaction => {
        this.transaction = transaction;
        this.detect();
      });
  }

  private listenToWalletChange(): void {
    this.webNodeDemoService.wallet$
      .pipe(untilDestroyed(this))
      .subscribe(wallet => {
        this.wallet = wallet;
        this.detect();
      });
  }

  // fundWallet(): void {
  //   this.webNodeDemoService.fundWallet();
  //   this.funding = true;
  // }
}
