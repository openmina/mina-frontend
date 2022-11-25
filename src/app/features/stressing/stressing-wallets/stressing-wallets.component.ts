import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { StressingWallet } from '@shared/types/stressing/stressing-wallet.type';
import { selectStressingWallets } from '@stressing/stressing.state';
import { filter } from 'rxjs';

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

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToWalletChanges();
  }

  private listenToWalletChanges(): void {
    this.store.select(selectStressingWallets)
      .pipe(untilDestroyed(this), filter(wallets => wallets.length > 0))
      .subscribe(wallets => {
        this.wallets = wallets;
        this.detect();
      });
  }
}

