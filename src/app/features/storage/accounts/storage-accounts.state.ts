import { StorageAccount } from '@shared/types/storage/accounts/storage-account.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectStorageAccountsState } from '@storage/storage.state';
import { StorageAccountsFilter } from '@storage/accounts/storage-accounts-filter/storage-accounts-filter.component';
import { StorageAccountsPagination } from '@shared/types/storage/accounts/storage-accounts-pagination.type';


export interface StorageAccountsState {
  accounts: StorageAccount[];
  activeAccount: StorageAccount;
  activeFilters: StorageAccountsFilter[];
  revisionIds: string[];
  pagination: StorageAccountsPagination;
}

const select = <T>(selector: (state: StorageAccountsState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectStorageAccountsState,
  selector,
);

export const selectStorageAccountsAccountList = select((state: StorageAccountsState): StorageAccount[] => state.accounts);
export const selectStorageAccountsActiveAccount = select((state: StorageAccountsState): StorageAccount => state.activeAccount);
export const selectStorageAccountsActiveFilters = select((state: StorageAccountsState): StorageAccountsFilter[] => state.activeFilters);
export const selectStorageAccountsRevisionIds = select((state: StorageAccountsState): string[] => state.revisionIds);
export const selectStorageAccountsPagination = select((state: StorageAccountsState): StorageAccountsPagination => state.pagination);
