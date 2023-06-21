import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, map, switchMap, tap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { ExplorerTransactionsService } from '@explorer/transactions/explorer-transactions.service';
import {
  EXPLORER_TRANSACTIONS_CLOSE,
  EXPLORER_TRANSACTIONS_CREATE_TX,
  EXPLORER_TRANSACTIONS_CREATE_TX_SUCCESS,
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS,
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS,
  ExplorerTransactionsActions,
  ExplorerTransactionsClose,
  ExplorerTransactionsCreateTx,
  ExplorerTransactionsGetTransactions,
} from '@explorer/transactions/explorer-transactions.actions';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';
import { ExplorerSignedTransaction } from '@shared/types/explorer/transactions/explorer-signed-transaction.type';
import { ExplorerZkAppTransaction } from '@shared/types/explorer/transactions/explorer-zk-app-transaction.type';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';

@Injectable({
  providedIn: 'root',
})
export class ExplorerTransactionsEffects extends MinaBaseEffect<ExplorerTransactionsActions> {

  readonly getTxs$: Effect;
  readonly newTx$: Effect;

  constructor(private router: Router,
              private actions$: Actions,
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
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS, []),
    ));

    this.newTx$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_TRANSACTIONS_CREATE_TX),
      this.latestActionState<ExplorerTransactionsCreateTx>(),
      switchMap(({ action }) => action.payload.txType === 'tx'
        ? this.blocksService.sendSignedTx(action.payload.tx as ExplorerSignedTransaction)
        : this.blocksService.sendZkAppTx(action.payload.tx as ExplorerZkAppTransaction),
      ),
      tap(() => this.router.navigate([Routes.EXPLORER, Routes.TRANSACTIONS])),
      map(() => ({ type: EXPLORER_TRANSACTIONS_CREATE_TX_SUCCESS })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, EXPLORER_TRANSACTIONS_CREATE_TX_SUCCESS),
    ));
  }
}
