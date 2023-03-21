import { Injectable } from '@angular/core';
import { WebNodeWallet } from '@shared/types/web-node/wallet/web-node-wallet.type';
import { catchError, first, forkJoin, map, Observable, of, tap } from 'rxjs';
import { WebNodeService } from '@web-node/web-node.service';
import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GraphQLService } from '@core/services/graph-ql.service';
import { ConfigService } from '@core/services/config.service';


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
    priv_key: '0223f442baabc6e317975fbcf8fe04f3a3646e108a1ce29db6fd46c15bfe62f2',
    pub_key: 'B62qndFPKf1RvLiSNouqnPE73Ndk5W2bTumri9CPfxGWF6wDsMtYEce',
  },
  {
    priv_key: '1e54ebc03a33e4eeae6a680ededa25a3342640c069eba4150bac34e062dee582',
    pub_key: 'B62qnNPSRV5MB4fLQfBDMVsJuNPD3oBxkrg5m2ifGHBvez9EVqHPaE2',
  },
  {
    priv_key: '3cae2a0b6ed5ba57539aaad98b656473e2675cea293743ceade3112ece81b362',
    pub_key: 'B62qp3fRYfmnFAsS4QC5gYZjEcZN5k5buu3sFXfjmbt2Wnhs4mCYLck',
  },
  {
    priv_key: '3cfd20ffad43a2408f6afb1d1cefb399d2c0cdc8fe8dfa1243ddbab62182e95d',
    pub_key: 'B62qkyFv9GTTjtGAxFTzVod1cp7NCQnavAVTNQ9aq4qJRNgNuhdgu8F',
  },
];

@Injectable({
  providedIn: 'root',
})
export class WebNodeWalletService {

  constructor(private http: HttpClient,
              private config: ConfigService,
              private graphQL: GraphQLService,
              private webNodeService: WebNodeService) { }

  getWallets(): Observable<Array<WebNodeWallet | HttpErrorResponse>> {
    if (!localStorage.getItem('wallets')) {
      localStorage.setItem('wallets', JSON.stringify(DEFAULT_WALLETS));
    }

    let wallets = JSON.parse(localStorage.getItem('wallets')) as any[];
    wallets = wallets.filter(w => w.pub_key !== 'B62qkzCCgvnnySwE3iwBi5d5fj5uNXvnUXXkoZGhUjos3VgZqRzh94U'); //broken wallet...

    return forkJoin(
      wallets.map(wallet => this.getAccount(wallet.pub_key)
        .pipe(catchError(err => of(err))),
      ),
    ).pipe(
      map(response => {
        return response.map((r: any | HttpErrorResponse, i: number) => r.account
          ? ({
            publicKey: wallets[i].pub_key,
            privateKey: wallets[i].priv_key,
            minaTokens: Number(r.account.balance.total),
          })
          : r,
        );
      }),
    );
  }

  getAccount(publicKey: string): Observable<any> {
    return this.http.get<any>(this.config.MINA_EXPLORER + '/accounts/' + publicKey);
  }

  createTransaction(transaction: WebNodeTransaction): Observable<string> {
    return this.webNodeService.createTransaction(transaction);
  }

  getTransactions<T = WebNodeTransaction>(publicKey: string, onlyOfThisKey: boolean = true): Observable<T[]> {
    // return of([
    //   {
    //     'id': '42543653635',
    //     'priv_key': '5464t354523',
    //     'to': 'B62qndFPKf1RvLiSNouqnPE73Ndk5W2bTumri9CPfxGWF6wDsMtYEce',
    //     'amount': '155',
    //     'fee': '54',
    //     'nonce': '1',
    //     'memo': 'Pariatur autem voluptatem rerstinctio.',
    //     'from': 'B62qkyFv9GTTjtGAxFTzVod1cp7NCQnavAVTNQ9aq4qJRNgNuhdgu8F',
    //     'blockHeight': 20,
    //     'kind': 'erw4334234523',
    //     'blockStateHash': 'Dolorum.',
    //     'dateTime': Date.parse('2022-12-12'),
    //     'hash': 'dolores.',
    //     'status': 'included',
    //     'isInMempool': false,
    //   },
    //   {
    //     'id': '42543653635',
    //     'priv_key': '5464t354523',
    //     'to': 'B62qndFPKf1RvLiSNouqnPE73Ndk5W2bTumri9CPfxGWF6wDsMtYEce',
    //     'amount': '155',
    //     'fee': '54',
    //     'nonce': '1',
    //     'memo': 'Pariatur autem voluptatem rerstinctio.',
    //     'from': 'B62qkyFv9GTTjtGAxFTzVod1cp7NCQnavAVTNQ9aq4qJRNgNuhdgu8F',
    //     'blockHeight': 20,
    //     'kind': 'erw4334234523',
    //     'blockStateHash': 'Dolorum.',
    //     'dateTime': Date.parse('2022-12-12'),
    //     'hash': 'dolores.',
    //     'status': 'included',
    //     'isInMempool': false,
    //   },
    //   {
    //     'id': '42543653635',
    //     'priv_key': '5464t354523',
    //     'to': 'B62qndFPKf1RvLiSNouqnPE73Ndk5W2bTumri9CPfxGWF6wDsMtYEce',
    //     'amount': '155',
    //     'fee': '54',
    //     'nonce': '1',
    //     'memo': 'Pariatur autem voluptatem rerstinctio.',
    //     'from': 'B62qkyFv9GTTjtGAxFTzVod1cp7NCQnavAVTNQ9aq4qJRNgNuhdgu8F',
    //     'blockHeight': 20,
    //     'kind': 'erw4334234523',
    //     'blockStateHash': 'Dolorum.',
    //     'dateTime': Date.parse('2022-12-12'),
    //     'hash': 'dolores.',
    //     'status': 'included',
    //     'isInMempool': false,
    //   },
    //   {
    //     'id': '42543653635',
    //     'priv_key': '5464t354523',
    //     'to': 'B62qndFPKf1RvLiSNouqnPE73Ndk5W2bTumri9CPfxGWF6wDsMtYEce',
    //     'amount': '155',
    //     'fee': '54',
    //     'nonce': '1',
    //     'memo': 'Pariatur autem voluptatem rerstinctio.',
    //     'from': 'B62qkyFv9GTTjtGAxFTzVod1cp7NCQnavAVTNQ9aq4qJRNgNuhdgu8F',
    //     'blockHeight': 20,
    //     'kind': 'erw4334234523',
    //     'blockStateHash': 'Dolorum.',
    //     'dateTime': Date.parse('2022-12-12'),
    //     'hash': 'dolores.',
    //     'status': 'included',
    //     'isInMempool': false,
    //   },
    //   {
    //     'id': '42543653635',
    //     'priv_key': '5464t354523',
    //     'to': 'B62qndFPKf1RvLiSNouqnPE73Ndk5W2bTumri9CPfxGWF6wDsMtYEce',
    //     'amount': '155',
    //     'fee': '54',
    //     'nonce': '1',
    //     'memo': 'Pariatur autem voluptatem rerstinctio.',
    //     'from': 'B62qkyFv9GTTjtGAxFTzVod1cp7NCQnavAVTNQ9aq4qJRNgNuhdgu8F',
    //     'blockHeight': 20,
    //     'kind': 'erw4334234523',
    //     'blockStateHash': 'Dolorum.',
    //     'dateTime': Date.parse('2022-12-12'),
    //     'hash': 'dolores.',
    //     'status': 'included',
    //     'isInMempool': false,
    //   },
    //   {
    //     'id': '42543653635',
    //     'priv_key': '5464t354523',
    //     'to': 'B62qndFPKf1RvLiSNouqnPE73Ndk5W2bTumri9CPfxGWF6wDsMtYEce',
    //     'amount': '155',
    //     'fee': '54',
    //     'nonce': '1',
    //     'memo': 'Pariatur autem voluptatem rerstinctio.',
    //     'from': 'B62qkyFv9GTTjtGAxFTzVod1cp7NCQnavAVTNQ9aq4qJRNgNuhdgu8F',
    //     'blockHeight': 20,
    //     'kind': 'erw4334234523',
    //     'blockStateHash': 'Dolorum.',
    //     'dateTime': Date.parse('2022-12-12'),
    //     'hash': 'dolores.',
    //     'status': 'included',
    //     'isInMempool': false,
    //   },
    //   {
    //     'id': '42543653635',
    //     'priv_key': '5464t354523',
    //     'to': 'B62qndFPKf1RvLiSNouqnPE73Ndk5W2bTumri9CPfxGWF6wDsMtYEce',
    //     'amount': '155',
    //     'fee': '54',
    //     'nonce': '1',
    //     'memo': 'Pariatur autem voluptatem rerstinctio.',
    //     'from': 'B62qkyFv9GTTjtGAxFTzVod1cp7NCQnavAVTNQ9aq4qJRNgNuhdgu8F',
    //     'blockHeight': 20,
    //     'kind': 'erw4334234523',
    //     'blockStateHash': 'Dolorum.',
    //     'dateTime': Date.parse('2022-12-12'),
    //     'hash': 'dolores.',
    //     'status': 'included',
    //     'isInMempool': false,
    //   },
    //   {
    //     'id': '42543653635',
    //     'priv_key': '5464t354523',
    //     'to': 'B62qndFPKf1RvLiSNouqnPE73Ndk5W2bTumri9CPfxGWF6wDsMtYEce',
    //     'amount': '155',
    //     'fee': '54',
    //     'nonce': '1',
    //     'memo': 'Pariatur autem voluptatem rerstinctio.',
    //     'from': 'B62qkyFv9GTTjtGAxFTzVod1cp7NCQnavAVTNQ9aq4qJRNgNuhdgu8F',
    //     'blockHeight': 20,
    //     'kind': 'erw4334234523',
    //     'blockStateHash': 'Dolorum.',
    //     'dateTime': Date.parse('2022-12-12'),
    //     'hash': 'dolores.',
    //     'status': 'included',
    //     'isInMempool': false,
    //   },
    //   {
    //     'id': '42543653635',
    //     'priv_key': '5464t354523',
    //     'to': 'B62qndFPKf1RvLiSNouqnPE73Ndk5W2bTumri9CPfxGWF6wDsMtYEce',
    //     'amount': '155',
    //     'fee': '54',
    //     'nonce': '1',
    //     'memo': 'Pariatur autem voluptatem rerstinctio.',
    //     'from': 'B62qkyFv9GTTjtGAxFTzVod1cp7NCQnavAVTNQ9aq4qJRNgNuhdgu8F',
    //     'blockHeight': 20,
    //     'kind': 'erw4334234523',
    //     'blockStateHash': 'Dolorum.',
    //     'dateTime': Date.parse('2022-12-12'),
    //     'hash': 'dolores.',
    //     'status': 'included',
    //     'isInMempool': false,
    //   },
    // ] as any);
    const appliedTransactions$: Observable<any[]> = this.http.get<any>(this.config.MINA_EXPLORER + '/blocks?limit=500')
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
          .filter((t: any) => onlyOfThisKey && (t.from === publicKey || t.to === publicKey))
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

  addTokensToWallet(publicKey: string, network: string = 'devnet'): Observable<any> {
    return this.http.post(this.config.GQL + '/faucet', {
      network,
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

