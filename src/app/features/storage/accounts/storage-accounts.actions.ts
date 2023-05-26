import { FeatureAction } from '@shared/types/store/feature-action.type';
import { StorageAccount } from '@shared/types/storage/accounts/storage-account.type';
import { StorageAccountsFilter } from '@storage/accounts/storage-accounts-filter/storage-accounts-filter.component';

enum StorageAccountsActionTypes {
  STORAGE_ACCOUNTS_GET_ACCOUNTS = 'STORAGE_ACCOUNTS_GET_ACCOUNTS',
  STORAGE_ACCOUNTS_GET_ACCOUNTS_SUCCESS = 'STORAGE_ACCOUNTS_GET_ACCOUNTS_SUCCESS',
  STORAGE_ACCOUNTS_SET_ACTIVE_ACCOUNT = 'STORAGE_ACCOUNTS_SET_ACTIVE_ACCOUNT',
  STORAGE_ACCOUNTS_TOGGLE_FILTER = 'STORAGE_ACCOUNTS_TOGGLE_FILTER',
  STORAGE_ACCOUNTS_CHANGE_PAGE = 'STORAGE_ACCOUNTS_CHANGE_PAGE',
  STORAGE_ACCOUNTS_CLOSE = 'STORAGE_ACCOUNTS_CLOSE',
  STORAGE_ACCOUNTS_GET_REVISION_IDS_SUCCESS = 'STORAGE_ACCOUNTS_GET_REVISION_IDS_SUCCESS',
}

export const STORAGE_ACCOUNTS_GET_ACCOUNTS = StorageAccountsActionTypes.STORAGE_ACCOUNTS_GET_ACCOUNTS;
export const STORAGE_ACCOUNTS_GET_ACCOUNTS_SUCCESS = StorageAccountsActionTypes.STORAGE_ACCOUNTS_GET_ACCOUNTS_SUCCESS;
export const STORAGE_ACCOUNTS_SET_ACTIVE_ACCOUNT = StorageAccountsActionTypes.STORAGE_ACCOUNTS_SET_ACTIVE_ACCOUNT;
export const STORAGE_ACCOUNTS_TOGGLE_FILTER = StorageAccountsActionTypes.STORAGE_ACCOUNTS_TOGGLE_FILTER;
export const STORAGE_ACCOUNTS_CHANGE_PAGE = StorageAccountsActionTypes.STORAGE_ACCOUNTS_CHANGE_PAGE;
export const STORAGE_ACCOUNTS_CLOSE = StorageAccountsActionTypes.STORAGE_ACCOUNTS_CLOSE;
export const STORAGE_ACCOUNTS_GET_REVISION_IDS_SUCCESS = StorageAccountsActionTypes.STORAGE_ACCOUNTS_GET_REVISION_IDS_SUCCESS;

export interface StorageAccountsAction extends FeatureAction<StorageAccountsActionTypes> {
  readonly type: StorageAccountsActionTypes;
}

export class StorageAccountsGetAccounts implements StorageAccountsAction {
  readonly type = STORAGE_ACCOUNTS_GET_ACCOUNTS;
}

export class StorageAccountsGetAccountsSuccess implements StorageAccountsAction {
  readonly type = STORAGE_ACCOUNTS_GET_ACCOUNTS_SUCCESS;

  constructor(public payload: StorageAccount[]) {}
}

export class StorageAccountsSetActiveAccount implements StorageAccountsAction {
  readonly type = STORAGE_ACCOUNTS_SET_ACTIVE_ACCOUNT;

  constructor(public payload: StorageAccount) {}
}

export class StorageAccountsToggleFilter implements StorageAccountsAction {
  readonly type = STORAGE_ACCOUNTS_TOGGLE_FILTER;

  constructor(public payload: { filters: StorageAccountsFilter[], type: 'add' | 'remove' }) {}
}

export class StorageAccountsChangePage implements StorageAccountsAction {
  readonly type = STORAGE_ACCOUNTS_CHANGE_PAGE;

  constructor(public payload: { start: number }) {}
}

export class StorageAccountsClose implements StorageAccountsAction {
  readonly type = STORAGE_ACCOUNTS_CLOSE;
}

export class StorageAccountsGetRevisionIdsSuccess implements StorageAccountsAction {
  readonly type = STORAGE_ACCOUNTS_GET_REVISION_IDS_SUCCESS;

  constructor(public payload: string[]) {}
}

export type StorageAccountsActions =
  | StorageAccountsGetAccounts
  | StorageAccountsGetAccountsSuccess
  | StorageAccountsSetActiveAccount
  | StorageAccountsToggleFilter
  | StorageAccountsChangePage
  | StorageAccountsClose
  | StorageAccountsGetRevisionIdsSuccess
  ;
