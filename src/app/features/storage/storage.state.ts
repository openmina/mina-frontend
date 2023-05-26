import { StorageAccountsState } from '@storage/accounts/storage-accounts.state';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';

export interface StorageState {
  accounts: StorageAccountsState;
}

const select = <T>(selector: (state: StorageState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectStorageState,
  selector,
);

export const selectStorageState = createFeatureSelector<StorageState>('storage');
export const selectStorageAccountsState = select((state: StorageState): StorageAccountsState => state.accounts);
