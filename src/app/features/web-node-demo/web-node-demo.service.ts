import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ONE_BILLION } from '@shared/constants/unit-measurements';

@Injectable({
  providedIn: 'root',
})
export class WebNodeDemoService {

  loadingWebNode = [
    { name: 'Loading wasm file', loaded: false },
    { name: 'Preparing block verifier', loaded: false },
    { name: 'Connecting to peers', loaded: false },
    { name: 'Downloading latest block', loaded: false },
  ];
  wallet: any = {
    publicKey: 'B62qptmpH9PVe76ZEfS1NWVV27XjZJEJyr8mWZFjfohxppmS11DfKFG',
    privateKey: 'B62qptmpH9PVe76ZEfS1NWVV27XjZJEJyr8mWZFjfohxppmS11DfKFG',
    balance: 100,
    nonce: 10,
  };
  webNode = {
    network: 'Berkeley Testnet',
    runningSince: 0,
    height: 1599,
  };
  transaction: any = undefined;

  readonly wallet$ = new BehaviorSubject(this.wallet);
  readonly webNode$ = new BehaviorSubject(this.webNode);
  readonly transaction$ = new BehaviorSubject(this.transaction);
  readonly loadingWebNode$ = new BehaviorSubject(this.loadingWebNode);
  readonly remainingUntilLoaded$ = new BehaviorSubject(20);

  constructor() {
    setTimeout(() => {
      this.loadingWebNode[0].loaded = true;
      this.loadingWebNode$.next(this.loadingWebNode);
      this.remainingUntilLoaded$.next(10);
    }, 1000);
    setTimeout(() => {
      this.loadingWebNode[1].loaded = true;
      this.remainingUntilLoaded$.next(5);
    }, 3000);
    setTimeout(() => {
      this.loadingWebNode[2].loaded = true;
      this.loadingWebNode$.next(this.loadingWebNode);
    this.remainingUntilLoaded$.next(2);
    }, 5000);
    setTimeout(() => {
      this.webNode.runningSince = Date.now();
      this.webNode$.next(this.webNode);
      this.loadingWebNode[3].loaded = true;
      this.loadingWebNode$.next(this.loadingWebNode);
    }, 7000);
  }

  // fundWallet(): void {
  //   setTimeout(() => {
  //     this.wallet.balance = 100;
  //     this.wallet$.next(this.wallet);
  //   }, 3000);
  // }

  createTx(tx: any): void {
    this.transaction = {
      amount: tx.amount.toString(),
      fee: tx.fee.toString(),
      from: tx.from,
      to: tx.to,
      nonce: tx.nonce,
      memo: tx.memo,
      kind: 'payment',
      status: 'pending',
      hash: 'CkpZNDnLzvTque1PwJcn7YsHzAnnFJ9YvWbFmFEfGU3LzfQRjDDky',
    };
    this.transaction$.next(this.transaction);
  }

  includeTransaction(): void {
    this.webNode.height = this.webNode.height + 1;
    this.webNode$.next(this.webNode);

    this.transaction = {
      ...this.transaction,
      status: 'included',
      height: this.webNode.height,
    };
    this.transaction$.next(this.transaction);

    this.wallet.nonce++;
    this.wallet.balance = this.wallet.balance - Number(this.transaction.amount) - Number(this.transaction.fee);
    this.wallet$.next(this.wallet);
  }
}
