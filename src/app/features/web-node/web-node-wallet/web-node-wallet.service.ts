import { Injectable } from '@angular/core';
import { WebNodeWallet } from '@shared/types/web-node/wallet/web-node-wallet.type';
import { first, forkJoin, map, Observable, of, tap } from 'rxjs';
import { WebNodeService } from '@web-node/web-node.service';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '@shared/constants/config';
import { GraphQLService } from '@core/services/graph-ql.service';


const DEFAULT_WALLETS = [
  {
    priv_key: '3c6850502d348fec34dca20739629ac95877dfaf1822abb9be155aa1a1bdf353',
    pub_key: 'B62qkzCCgvnnySwE3iwBi5d5fj5uNXvnUXXkoZGhUjos3VgZqRzh94U',
  },
  {
    priv_key: '02aae0a83fecc9ff0fec19d7f5c914810f60e6a3e32a83fc4c4aebac42769dda',
    pub_key: 'B62qqhCawV18yp1jYd7efF6gyDuJPBLYqKEnq3XJp4MaPMdQreWo4Go',
  },
  {
    priv_key: '1d435841e97738fdfa8fd91bd2da857834da74cc897fa7c02dfb3bcd42278b8c',
    pub_key: 'B62qju27yaf7RqsBk6toLfTmgn6QE19YFQDKD4fKsW8rJCuiKyncxkj',
  },
  {
    priv_key: '163c19c85d09a13ff85ebe8d70f38c5b7325fc78bc728113db5397957e942dc1',
    pub_key: 'B62qrt7gK25e8XBYAMSJjK5mbcF8UVQMS7RFunxNAZSi1SNY7Q42xyA',
  },
  {
    priv_key: '1c482acd8be9ed27519c8049b5006ba4d5a1cba57a07cf690a067acd50dae6ca',
    pub_key: 'B62qj7jX5sq4vM3pgvS1ybcboSeBC3T8Hg1ov6jt6JkcQ7WeFk7y9vP',
  },
  {
    priv_key: '19711c83f4818cf6f3c5ffcd5b47a07e6fff4adb01dc0ca607eb8a7974114504',
    pub_key: 'B62qmq15hp12cs49yyX2FLW87oTNTyi1zbukvs3ZwcnHdUpikRosCGJ',
  },
  {
    priv_key: '35d59a49e70a75907f77aec37740f28e685f8780c2135017b1adcdb2a74f63d9',
    pub_key: 'B62qmhEBbuuEk3davEfNGAgQ3YETgpV71eGEqXTWMwAeif6aiTuYvvA',
  },
  {
    priv_key: '126144cdc96047495d552972406b8ba662612ebed4b518a3074c744f3894cf03',
    pub_key: 'B62qqVUaWaxFmFyu6Ec8vxzbCZqNuGDi9c5XGyK6qKSDRELdK856NPR',
  },
];

@Injectable({
  providedIn: 'root',
})
export class WebNodeWalletService {

  private readonly MINA_EXPLORER: string = CONFIG.minaExplorer;
  private readonly BACKEND: string = CONFIG.backend;

  constructor(private webNodeService: WebNodeService,
              private http: HttpClient,
              private graphQL: GraphQLService) { }

  getWallets(): Observable<WebNodeWallet[]> {
    if (!localStorage.getItem('wallets')) {
      localStorage.setItem('wallets', JSON.stringify(DEFAULT_WALLETS));
    }

    const wallets = JSON.parse(localStorage.getItem('wallets')) as any[];

    return forkJoin(wallets.map(wallet => this.getAccount(wallet.pub_key)))
      .pipe(
        map(response => response.map((r: any, i: number) => ({
          publicKey: wallets[i].pub_key,
          privateKey: wallets[i].priv_key,
          minaTokens: Number(r.account.balance.total),
        }))),
      );
  }

  getAccount(publicKey: string): Observable<any> {
    return this.http.get<any>(this.MINA_EXPLORER + '/accounts/' + publicKey);
  }

  createTransaction(transaction: WebNodeTransaction): Observable<WebNodeTransaction> {
    return this.webNodeService.createTransaction(transaction);
  }

  getTransactions(publicKey: string): Observable<WebNodeTransaction[]> {
    const appliedTransactions$: Observable<any[]> = this.http.get<any>(this.MINA_EXPLORER + '/blocks?limit=500')
      .pipe(
        first(),
        map(response => response.blocks.reduce((acc: any, current: any) => [
          ...acc,
          ...current.transactions.userCommands
            .filter((t: any) => t.from === publicKey || t.to === publicKey)
            .map((t: any) => ({ ...t, status: 'included' })),
        ], [])),
      );
    const mempoolTransactions$: Observable<any[]> = this.graphQL.query<any>('pooledUserCommands',
      `{ pooledUserCommands { ... on UserCommandPayment {
            id
            hash
            fee
            amount
            kind
            nonce
            to
            memo
            from
            feeToken
            failureReason
            token
            validUntil } } }`)
      .pipe(
        first(),
        map((data: any) => data.pooledUserCommands
          .filter((t: any) => t.from === publicKey || t.to === publicKey)
          .map((t: any) => ({ ...t, isInMempool: true, status: 'pending' })),
        ),
      );
    return forkJoin([
      appliedTransactions$,
      mempoolTransactions$,
    ]).pipe(
      map((response: [any[], any[]]) => [...response[1], ...response[0]]),
    );
  }

  generateWallet(): any {
    const newWallet = this.webNodeService.generateWallet();

    const wallets = JSON.parse(localStorage.getItem('wallets')) as any[];
    wallets.push(newWallet);
    localStorage.setItem('wallets', JSON.stringify(wallets));

    return newWallet;
  }

  addTokensToWallet(publicKey: string): Observable<any> {
    return this.http.post(this.BACKEND + '/faucet', {
      network: 'devnet',
      address: publicKey,
    }, { headers: { 'Content-Type': 'application/json' } });
  }

  getTransactionStatuses(transactionIds: string[]): Observable<{ [id: string]: string }> {
    const mapResponse = {};
    const observables = transactionIds.map((id: string) =>
      this.graphQL.query<any>('transactionStatus', `{ transactionStatus(payment: "${id}") }`)
        .pipe(
          first(),
          tap((response: any) => mapResponse[id] = response.transactionStatus.toLowerCase()),
        ),
    );

    return forkJoin(observables).pipe(map(() => mapResponse));
  }
}

