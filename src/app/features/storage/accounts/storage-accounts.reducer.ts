import { StorageAccountsState } from '@storage/accounts/storage-accounts.state';
import {
  STORAGE_ACCOUNTS_CHANGE_PAGE,
  STORAGE_ACCOUNTS_CLOSE,
  STORAGE_ACCOUNTS_GET_ACCOUNTS_SUCCESS,
  STORAGE_ACCOUNTS_GET_REVISION_IDS_SUCCESS,
  STORAGE_ACCOUNTS_SET_ACTIVE_ACCOUNT,
  STORAGE_ACCOUNTS_TOGGLE_FILTER,
  StorageAccountsActions,
} from '@storage/accounts/storage-accounts.actions';

const initialState: StorageAccountsState = {
  accounts: [],
  activeAccount: undefined,
  activeFilters: [],
  revisionIds: [],
  pagination: {
    size: 10,
    start: 0,
  },
};

export function reducer(state: StorageAccountsState = initialState, action: StorageAccountsActions): StorageAccountsState {
  switch (action.type) {

    case STORAGE_ACCOUNTS_GET_ACCOUNTS_SUCCESS: {
      return {
        ...state,
        accounts: action.payload,
      };
    }

    case STORAGE_ACCOUNTS_SET_ACTIVE_ACCOUNT: {
      return {
        ...state,
        activeAccount: action.payload,
      };
    }

    case STORAGE_ACCOUNTS_TOGGLE_FILTER: {
      const activeFilters = action.payload.type === 'add'
        ? [
          ...state.activeFilters,
          ...action.payload.filters.filter(f => !state.activeFilters.some(fi => fi.value === f.value)),
        ]
        : state.activeFilters.filter(f => !action.payload.filters.some(fi => fi.value === f.value));

      return {
        ...state,
        activeFilters,
      };
    }

    case STORAGE_ACCOUNTS_GET_REVISION_IDS_SUCCESS: {
      return {
        ...state,
        revisionIds: action.payload,
      };
    }

    case STORAGE_ACCOUNTS_CHANGE_PAGE: {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          start: action.payload.start,
        }
      }
    }

    case STORAGE_ACCOUNTS_CLOSE:
      return initialState;

    default:
      return state;
  }
}
