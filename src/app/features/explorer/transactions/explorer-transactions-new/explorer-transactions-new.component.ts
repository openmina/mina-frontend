import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ExplorerTransactionsCreateTx } from '@explorer/transactions/explorer-transactions.actions';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { FormDefinitions, TypedFormGroup } from '@shared/types/shared/typed-form.type';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { merge } from 'rxjs';


interface TxForm extends FormDefinitions {
  tx: FormControl<string>;
  zk: FormControl<string>;
}

@Component({
  selector: 'mina-explorer-transactions-new',
  templateUrl: './explorer-transactions-new.component.html',
  styleUrls: ['./explorer-transactions-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerTransactionsNewComponent extends StoreDispatcher implements OnInit {

  private readonly txInit: string = '{\n  "input": {\n    "fee": "",\n    "amount": "",\n    "to": "",\n    "from": "",\n    "nonce": "",\n    "memo": "",\n    "validUntil": ""\n  },\n  "signature": {\n    "scalar": "",\n    "field": ""\n  }\n}';
  private readonly zkInit: string = '{\n  "input": {\n    "zkappCommand": {\n      "feePayer": {\n        "body": {\n          "publicKey": "",\n          "fee": "",\n          "nonce": ""\n        },\n        "authorization": ""\n      },\n      "accountUpdates": {\n        "body": {\n          "publicKey": "",\n          "tokenId": "",\n          "update": {\n            "appState": ""\n          },\n          "balanceChange": {\n            "magnitude": "",\n            "sgn": ""\n          },\n          "incrementNonce": false,\n          "events": "",\n          "actions": "",\n          "callData": "",\n          "callDepth": 10,\n          "preconditions": {\n            "network": {\n              "stakingEpochData": {\n                "ledger": {}\n              },\n              "nextEpochData": {\n                "ledger": {}\n              }\n            },\n            "account": {\n              "state": ""\n            }\n          },\n          "useFullCommitment": false,\n          "implicitAccountCreationFee": false,\n          "mayUseToken": {\n            "parentsOwnToken": false,\n            "inheritFromParent": false\n          },\n          "authorizationKind": {\n            "isSigned": false,\n            "isProved": false,\n            "verificationKeyHash": ""\n          }\n        },\n        "authorization": {}\n      },\n      "memo": ""\n    }\n  }\n}';

  txType: 'tx' | 'zk' = 'tx';
  formGroup: TypedFormGroup<TxForm>;
  error: boolean;

  constructor(private builder: FormBuilder,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.error = false;
    this.formGroup = this.builder.group<TxForm>({
      tx: new FormControl(this.txInit, Validators.required),
      zk: new FormControl(this.zkInit, Validators.required),
    }) as TypedFormGroup<TxForm>;

    merge(
      this.formGroup.get('tx').valueChanges,
      this.formGroup.get('zk').valueChanges,
    )
      .pipe(untilDestroyed(this))
      .subscribe(value => this.checkError(value));
  }

  private checkError(value: string): void {
    try {
      JSON.parse(value);
      this.error = false;
    } catch (e) {
      this.error = true;
    }
  }

  submit(): void {
    let tx: any;
    if (this.txType === 'tx') {
      tx = JSON.parse(this.formGroup.getRawValue().tx);
    } else {
      tx = JSON.parse(this.formGroup.getRawValue().zk);
    }
    this.dispatch(ExplorerTransactionsCreateTx, { txType: this.txType, tx });
  }

  selectTab(tx: 'tx' | 'zk'): void {
    this.txType = tx;
  }

  back(): void {
    this.router.navigate([Routes.EXPLORER, Routes.TRANSACTIONS]);
  }
}
