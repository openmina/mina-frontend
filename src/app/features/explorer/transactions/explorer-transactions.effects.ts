import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { catchError, EMPTY, map, repeat, switchMap } from 'rxjs';
import { addError } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { ExplorerTransactionsService } from '@explorer/transactions/explorer-transactions.service';
import {
  EXPLORER_TRANSACTIONS_CLOSE,
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS,
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS,
  ExplorerTransactionsActions, ExplorerTransactionsClose,
  ExplorerTransactionsGetTransactions,
} from '@explorer/transactions/explorer-transactions.actions';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerTransactionsEffects extends MinaBaseEffect<ExplorerTransactionsActions> {

  readonly getTxs$: Effect;

  constructor(private actions$: Actions,
              private blocksService: ExplorerTransactionsService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getTxs$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_TRANSACTIONS_GET_TRANSACTIONS, EXPLORER_TRANSACTIONS_CLOSE),
      this.latestActionState<ExplorerTransactionsGetTransactions | ExplorerTransactionsClose>(),
      switchMap(({ action }) =>
        action.type === EXPLORER_TRANSACTIONS_CLOSE
          ? EMPTY
          : this.blocksService.getTransactions(),
      ),
      map((payload: ExplorerTransaction[]) => ({ type: EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));
  }
}
