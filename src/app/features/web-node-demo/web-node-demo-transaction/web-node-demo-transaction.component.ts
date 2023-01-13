import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { WebNodeDemoService } from '@app/features/web-node-demo/web-node-demo.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-demo-transaction',
  templateUrl: './web-node-demo-transaction.component.html',
  styleUrls: ['./web-node-demo-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column mt-16' },
})
export class WebNodeDemoTransactionComponent extends ManualDetection implements OnInit {

  wallet: any;
  transaction: any;

  constructor(private webNodeDemoService: WebNodeDemoService) { super(); }

  ngOnInit(): void {
    this.webNodeDemoService.wallet$
      .pipe(untilDestroyed(this))
      .subscribe(wallet => {
        this.wallet = wallet;
        this.detect();
      });
    this.webNodeDemoService.transaction$
      .pipe(untilDestroyed(this))
      .subscribe(transaction => {
        this.transaction = transaction;
        this.detect();
      });
  }

}
