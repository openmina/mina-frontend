import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import {
  WEB_NODE_WALLET_CLOSE,
  WEB_NODE_WALLET_GET_WALLETS,
  WebNodeWalletClose,
  WebNodeWalletGetWallets,
} from '@web-node/web-node-wallet/web-node-wallet.actions';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-wallet',
  templateUrl: './web-node-wallet.component.html',
  styleUrls: ['./web-node-wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebNodeWalletComponent implements OnDestroy {

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.store.dispatch<WebNodeWalletGetWallets>({ type: WEB_NODE_WALLET_GET_WALLETS });
  }

  ngOnDestroy(): void {
    this.store.dispatch<WebNodeWalletClose>({ type: WEB_NODE_WALLET_CLOSE });
  }
}
