import { Injectable } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';
import { delay, map, Observable, of } from 'rxjs';
import { StorageAccount } from '@shared/types/storage/accounts/storage-account.type';
import { WALLETS } from '@benchmarks/wallets/benchmarks-wallets.service';

@Injectable({
  providedIn: 'root',
})
export class StorageAccountsService {

  constructor(private graphQL: GraphQLService) { }

  getAccounts(filters: string[], start: number, size: number): Observable<StorageAccount[]> {
    const walletsSlice = WALLETS.slice(0, 40);
    let query = '{';
    walletsSlice.forEach((wallet, i: number) => query += `account${i}: account(publicKey: "${wallet.publicKey}") {
    tokenId
    tokenSymbol
    balance {
      total
    }
    nonce
    timing {
      vestingPeriod
      vestingIncrement
      cliffTime
      initialMinimumBalance
      cliffAmount
    }
    votingFor
    zkappUri
    zkappState
    permissions {
      access
      send
    } }, `);
    query += '}';

    return this.graphQL.query<any>('getAccounts', query)
      .pipe(
        map((gqlResponse: any) => Object.keys(gqlResponse).map((key: any, i: number) => {
          const wall = gqlResponse[`account${i}`];
          return {
            publicKey: walletsSlice[i].publicKey,
            ...wall,
          };
        })),
      );
  }

  getRevisionIds(): Observable<string[]> {
    // return this.graphQL.query<any>('getRevisionIds', '{ revisionIds }')
    return of({ revisionIds: ['B62qoyDCsPSAAyAdfMPfJBntwC4Ny4BF1SWW1Y8uxDA2wGALN3itGbr', 'B62qjdLNsPPmgMnuowkM5DNkY7eyEstWfL7ACn3SJkU3t15RE3YVbHc', 'B62qqvxSokGBKd88wyTrEzr8S1s2LDLGtbd1eJo6izrc72bJHLn2PYA'] }).pipe(delay(100))
      .pipe(
        map((gqlResponse: any) => gqlResponse.revisionIds),
      );
  }
}
