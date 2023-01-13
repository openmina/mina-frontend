import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { WebNodeDemoService } from '@app/features/web-node-demo/web-node-demo.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Router } from '@angular/router';

class NewTransactionForm {
  to: FormControl<string>;
  amount: FormControl<number>;
  fee: FormControl<number>;
  memo: FormControl<string>;
}

@UntilDestroy()
@Component({
  selector: 'mina-web-node-demo-create-transaction',
  templateUrl: './web-node-demo-create-transaction.component.html',
  styleUrls: ['./web-node-demo-create-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebNodeDemoCreateTransactionComponent extends ManualDetection implements OnInit,AfterViewInit {

  formGroup: FormGroup<NewTransactionForm>;

  private wallet: any;

  @ViewChild('firstInput') private firstInput: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder,
              private webNodeDemoService: WebNodeDemoService,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.initForm();
    this.listenToWalletChange();
  }

  ngAfterViewInit(): void {
    this.firstInput.nativeElement.focus();
  }

  private listenToWalletChange(): void {
    this.webNodeDemoService.wallet$
      .pipe(untilDestroyed(this))
      .subscribe(wallet => {
        this.wallet = wallet;
        this.detect();
      });
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group<NewTransactionForm>({
      to: new FormControl(),
      amount: new FormControl(),
      fee: new FormControl(),
      memo: new FormControl(),
    });
  }

  confirmTransaction(): void {
    const tx = {
      from: this.wallet.publicKey,
      to: this.formGroup.getRawValue().to,
      amount: this.formGroup.getRawValue().amount,
      fee: this.formGroup.getRawValue().fee,
      memo: this.formGroup.getRawValue().memo,
      nonce: this.wallet.nonce,
    }
    this.webNodeDemoService.createTx(tx);
    this.router.navigate(['web-node-demo']);
  }
}
