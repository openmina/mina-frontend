import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GraphQLService } from '@core/services/graph-ql.service';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerTransactionsService {

  constructor(private graphQL: GraphQLService) { }

  getTransactions(): Observable<ExplorerTransaction[]> {
    return this.graphQL.query('pooledUserCommands',
      `{ pooledUserCommands { ... on UserCommandPayment {
            id
            hash
            fee
            amount
            kind
            nonce
            to
            memo
            memoVerbatim
            from } } }`)
      .pipe(
        map((data: any) => data.pooledUserCommands
          .map((tx: any) => ({
            ...tx,
            memo: tx.memoVerbatim || tx.memo,
            amount: Number(tx.amount),
            status: 'pending',
          } as ExplorerTransaction)),
        ),
      );
  }
}
