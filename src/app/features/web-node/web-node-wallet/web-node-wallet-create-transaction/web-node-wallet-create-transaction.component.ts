import { ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { WebNodeWallet } from '@shared/types/web-node/wallet/web-node-wallet.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectWebNodeActiveWallet, selectWebNodeWallets } from '@web-node/web-node-wallet/web-node-wallet.state';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { WEB_NODE_WALLET_CREATE_TRANSACTION, WebNodeWalletCreateTransaction } from '@web-node/web-node-wallet/web-node-wallet.actions';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';
import { WebNodeWalletService } from '@web-node/web-node-wallet/web-node-wallet.service';
import { selectAppNodeStatus } from '@app/app.state';
import { filter, take } from 'rxjs';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { NodeStatus } from '@shared/types/app/node-status.type';

interface TransactionForm {
  recipient: FormControl<string>;
  amount: FormControl<number>;
  fee: FormControl<number>;
  nonce: FormControl<number>;
  memo: FormControl<string>;
}

@UntilDestroy()
@Component({
  selector: 'mina-web-node-wallet-create-stressing',
  templateUrl: './web-node-wallet-create-transaction.component.html',
  styleUrls: ['./web-node-wallet-create-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class WebNodeWalletCreateTransactionComponent extends ManualDetection implements OnInit {

  wallets: WebNodeWallet[];
  formGroup: FormGroup<TransactionForm>;
  activeStep: number = 0;

  private activeWallet: WebNodeWallet;
  private overlayRef: OverlayRef;
  @ViewChild('dropdownTemplate') private dropdownTemplate: TemplateRef<any>;
  @ViewChild('dropdownTrigger') private dropdownTrigger: ElementRef<HTMLDivElement>;

  constructor(private store: Store<MinaState>,
              private formBuilder: FormBuilder,
              private router: Router,
              private webNodeWalletService: WebNodeWalletService,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { super(); }

  ngOnInit(): void {
    this.initForm();
    this.listenToWalletChanges();
    this.listenToNodeChanges();
  }

  private listenToNodeChanges(): void {
    this.store.select(selectAppNodeStatus)
      .pipe(
        untilDestroyed(this),
        filter(node => node.status !== AppNodeStatusTypes.CONNECTING),
        take(1),
      )
      .subscribe((node: NodeStatus) => {
        if (node.status !== AppNodeStatusTypes.SYNCED) {
          this.router.navigate([Routes.WEB_NODE, Routes.WALLET]);
        }
      });
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group<TransactionForm>({
      recipient: new FormControl(),
      amount: new FormControl(),
      fee: new FormControl(),
      nonce: new FormControl({ value: null, disabled: true }),
      memo: new FormControl(),
    });
  }

  private listenToWalletChanges(): void {
    this.store.select(selectWebNodeActiveWallet)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
      )
      .subscribe((activeWallet: WebNodeWallet) => {
        this.activeWallet = activeWallet;
        this.getNonce();

        this.store.select(selectWebNodeWallets)
          .pipe(untilDestroyed(this))
          .subscribe((wallets: WebNodeWallet[]) => {
            this.wallets = wallets.filter(w => w.publicKey !== this.activeWallet.publicKey);
            this.formGroup.get('recipient').setValue(this.wallets[0].publicKey);
            this.detect();
          });

      });
  }

  openDropdown(event: MouseEvent): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      width: this.dropdownTrigger.nativeElement.offsetWidth,
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

    const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  detachOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  selectRecipient(wallet: WebNodeWallet): void {
    this.formGroup.get('recipient').setValue(wallet.publicKey);
    this.detect();
    this.detachOverlay();
  }

  nextStep(): void {
    if (this.activeStep === 1) {
      this.sendTransaction();
    } else if (this.activeStep === 2) {
      this.router.navigate([Routes.WEB_NODE, Routes.WALLET]);
    }
    this.activeStep++;
  }

  prevStep(): void {
    this.activeStep--;
  }

  private sendTransaction(): void {
    const value = this.formGroup.getRawValue();
    const transaction = {
      priv_key: this.activeWallet.privateKey,
      to: value.recipient,
      amount: value.amount.toString(),
      fee: value.fee.toString(),
      nonce: value.nonce.toString(),
      memo: value.memo,
    } as WebNodeTransaction;
    this.store.dispatch<WebNodeWalletCreateTransaction>({ type: WEB_NODE_WALLET_CREATE_TRANSACTION, payload: transaction });
  }

  private getNonce(): void {
    this.webNodeWalletService.getAccount(this.activeWallet.publicKey)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.formGroup.get('nonce').setValue(response.account.nonce);
      });
  }
}
