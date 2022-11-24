import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StressingService } from '@app/features/stressing/stressing.service';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { STRESSING_GET_WALLETS, StressingGetWallets } from '@stressing/stressing.actions';
import { StressingWallet } from '@shared/types/stressing/stressing-wallet.type';
import { selectStressingWallets } from '@stressing/stressing.state';

@UntilDestroy()
@Component({
  selector: 'mina-stressing-wallets',
  templateUrl: './stressing-wallets.component.html',
  styleUrls: ['./stressing-wallets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class StressingWalletsComponent extends ManualDetection implements OnInit {

  wallets: StressingWallet[];

  constructor(private stressingService: StressingService,
              private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToWalletChanges();
  }

  private listenToWalletChanges(): void {
    this.store.select(selectStressingWallets)
      .pipe(untilDestroyed(this))
      .subscribe(wallets => {
        this.wallets = wallets;
        this.detect();
      });
  }

  sendTransaction(): void {
    this.stressingService.createTransaction(this.wallets[0], this.wallets[1].publicKey);
  }
}

