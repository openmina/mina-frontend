import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  STORAGE_ACCOUNTS_CHANGE_PAGE,
  STORAGE_ACCOUNTS_GET_ACCOUNTS,
  STORAGE_ACCOUNTS_GET_ACCOUNTS_SUCCESS,
  STORAGE_ACCOUNTS_GET_REVISION_IDS_SUCCESS,
  STORAGE_ACCOUNTS_TOGGLE_FILTER,
  StorageAccountsActions,
  StorageAccountsGetAccounts,
} from '@storage/accounts/storage-accounts.actions';
import { StorageAccountsService } from '@storage/accounts/storage-accounts.service';
import { StorageAccount } from '@shared/types/storage/accounts/storage-account.type';

@Injectable({
  providedIn: 'root',
})
export class StorageAccountsEffects extends MinaBaseEffect<StorageAccountsActions> {

  readonly getAccounts$: Effect;
  readonly getRevisionIds$: Effect;

  constructor(private actions$: Actions,
              private accountsService: StorageAccountsService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getAccounts$ = createEffect(() => this.actions$.pipe(
      ofType(STORAGE_ACCOUNTS_GET_ACCOUNTS, STORAGE_ACCOUNTS_TOGGLE_FILTER, STORAGE_ACCOUNTS_CHANGE_PAGE),
      this.latestActionState<StorageAccountsGetAccounts>(),
      switchMap(({ state }) => this.accountsService.getAccounts(
        state.storage.accounts.activeFilters.map(f => f.value),
        state.storage.accounts.pagination.start,
        state.storage.accounts.pagination.size,
      )),
      map((payload: StorageAccount[]) => ({ type: STORAGE_ACCOUNTS_GET_ACCOUNTS_SUCCESS, payload })),
    ));

    this.getRevisionIds$ = createEffect(() => this.actions$.pipe(
      ofType(STORAGE_ACCOUNTS_GET_ACCOUNTS),
      switchMap(() => this.accountsService.getRevisionIds()),
      map((payload: string[]) => ({ type: STORAGE_ACCOUNTS_GET_REVISION_IDS_SUCCESS, payload })),
    ));
  }
}
