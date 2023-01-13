import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { WebNodeDemoService } from '@app/features/web-node-demo/web-node-demo.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-demo-wallet',
  templateUrl: './web-node-demo-wallet.component.html',
  styleUrls: ['./web-node-demo-wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebNodeDemoWalletComponent extends ManualDetection implements OnInit {

  balance: number;
  publicKey: string;

  constructor(private webNodeDemoService: WebNodeDemoService) { super(); }

  ngOnInit(): void {
    this.webNodeDemoService.wallet$
      .pipe(untilDestroyed(this))
      .subscribe(wallet => {
        this.publicKey = wallet?.publicKey;
        this.balance = wallet?.balance;
        this.detect();
      });
  }

}
