import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS,
  BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS,
  BenchmarksTransactionsActions,
} from '@benchmarks/transactions/benchmarks-transactions.actions';
import { BenchmarksTransactionsService } from '@benchmarks/transactions/benchmarks-transactions.service';
import { BenchmarksTransaction } from '@shared/types/benchmarks/transactions/benchmarks-transaction.type';

@Injectable({
  providedIn: 'root',
})
export class BenchmarksTransactionsEffects extends MinaBaseEffect<BenchmarksTransactionsActions> {

  readonly getTxs$: Effect;

  constructor(private actions$: Actions,
              private transactionsService: BenchmarksTransactionsService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getTxs$ = createEffect(() => this.actions$.pipe(
      ofType(BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS),
      switchMap(() => this.transactionsService.getTransactions()),
      map((payload: BenchmarksTransaction[]) => ({ type: BENCHMARKS_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS, payload })),
    ));
  }
}
