import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WebNodeWallet } from '@shared/types/web-node/wallet/web-node-wallet.type';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Router } from '@angular/router';
import { WebNodeWalletService } from '@web-node/web-node-wallet/web-node-wallet.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Routes } from '@shared/enums/routes.enum';
import { WEB_NODE_WALLET_CHANGE_WALLET, WebNodeWalletChangeWallet } from '@web-node/web-node-wallet/web-node-wallet.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-wallet-create-wallet',
  templateUrl: './web-node-wallet-create-wallet.component.html',
  styleUrls: ['./web-node-wallet-create-wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class WebNodeWalletCreateWalletComponent extends ManualDetection {

  activeStep: number = 0;
  newWallet: WebNodeWallet;
  tokensRequested: boolean;
  requestingTokensInProgress: boolean;

  constructor(private store: Store<MinaState>,
              private formBuilder: FormBuilder,
              private router: Router,
              private webNodeWalletService: WebNodeWalletService) { super(); }

  nextStep(): void {
    if (this.activeStep === 0 && !this.newWallet) {
      this.generateWallet();
      return;
    } else if (this.activeStep === 1 && !this.tokensRequested) {
      this.getTokens();
      return;
    } else if (this.activeStep === 2) {
      this.router.navigate([Routes.WEB_NODE, Routes.WALLET]);
      this.store.dispatch<WebNodeWalletChangeWallet>({ type: WEB_NODE_WALLET_CHANGE_WALLET, payload: this.newWallet });
    }
    this.activeStep++;
  }

  prevStep(): void {
    this.activeStep--;
  }

  private generateWallet(): void {
    const newWallet = this.webNodeWalletService.generateWallet();
    this.newWallet = {
      privateKey: newWallet.priv_key,
      publicKey: newWallet.pub_key,
      minaTokens: 0,
    };
  }

  private getTokens(): void {
    this.requestingTokensInProgress = true;
    this.webNodeWalletService.addTokensToWallet(this.newWallet.publicKey)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.tokensRequested = true;
        this.requestingTokensInProgress = false;
        this.activeStep++;
        this.detect();
      });
  }
}
