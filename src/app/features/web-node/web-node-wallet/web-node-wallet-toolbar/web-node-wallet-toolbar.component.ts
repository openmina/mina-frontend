import { ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { WebNodeWallet } from '@shared/types/web-node/wallet/web-node-wallet.type';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectWebNodeActiveWallet, selectWebNodeWallets } from '@web-node/web-node-wallet/web-node-wallet.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import {
  WEB_NODE_WALLET_CHANGE_WALLET,
  WEB_NODE_WALLET_GET_TRANSACTIONS,
  WebNodeWalletChangeWallet,
  WebNodeWalletGetTransactions,
} from '@web-node/web-node-wallet/web-node-wallet.actions';
import { selectAppNodeStatus } from '@app/app.state';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { NodeStatus } from '@shared/types/app/node-status.type';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-wallet-toolbar',
  templateUrl: './web-node-wallet-toolbar.component.html',
  styleUrls: ['./web-node-wallet-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebNodeWalletToolbarComponent extends ManualDetection implements OnInit {

  wallets: WebNodeWallet[];
  activeWallet: WebNodeWallet;
  nodeStatus: AppNodeStatusTypes;

  private overlayRef: OverlayRef;

  @ViewChild('walletDropdown') private walletDropdown: TemplateRef<any>;
  @ViewChild('dropdownTrigger') private dropdownTrigger: ElementRef<HTMLDivElement>;

  constructor(private store: Store<MinaState>,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { super(); }

  ngOnInit(): void {
    this.listenToWalletChanges();
    this.listenToNodeChanges();
  }

  private listenToNodeChanges(): void {
    this.store.select(selectAppNodeStatus)
      .pipe(
        untilDestroyed(this),
        filter(status => status.status !== this.nodeStatus),
      )
      .subscribe((status: NodeStatus) => {
        this.nodeStatus = status.status;
        this.detect();
      });
  }

  private listenToWalletChanges(): void {
    this.store.select(selectWebNodeWallets)
      .pipe(untilDestroyed(this))
      .subscribe((wallets: WebNodeWallet[]) => {
        this.wallets = wallets;
        this.detect();
      });
    this.store.select(selectWebNodeActiveWallet)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
      )
      .subscribe((activeWallet: WebNodeWallet) => {
        this.activeWallet = activeWallet;
        this.store.dispatch<WebNodeWalletGetTransactions>({
          type: WEB_NODE_WALLET_GET_TRANSACTIONS,
          payload: { publicKey: activeWallet.publicKey },
        });
        this.detect();
      });
  }

  openDropdown(event: MouseEvent): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      width: 330,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.dropdownTrigger.nativeElement)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 35,
        }]),
    });
    event.stopPropagation();

    const portal = new TemplatePortal(this.walletDropdown, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  detachOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  changeWallet(wallet: WebNodeWallet): void {
    this.store.dispatch<WebNodeWalletChangeWallet>({ type: WEB_NODE_WALLET_CHANGE_WALLET, payload: wallet });
    this.detachOverlay();
  }
}
