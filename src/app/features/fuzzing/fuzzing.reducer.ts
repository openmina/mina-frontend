import { FuzzingState } from '@fuzzing/fuzzing.state';
import {
  FUZZING_CLOSE,
  FUZZING_GET_FILE_DETAILS,
  FUZZING_GET_FILE_DETAILS_SUCCESS,
  FUZZING_GET_FILES_SUCCESS,
  FUZZING_SORT,
  FuzzingActions,
} from '@fuzzing/fuzzing.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';

const initialState: FuzzingState = {
  files: [],
  activeFile: undefined,
  activeFileDetails: undefined,
  sort: {
    sortDirection: SortDirection.DSC,
    sortBy: 'path',
  }
};

export function reducer(state: FuzzingState = initialState, action: FuzzingActions): FuzzingState {
  switch (action.type) {

    case FUZZING_GET_FILES_SUCCESS: {
      return {
        ...state,
        files: sortFiles(action.payload, state.sort),
      };
    }

    case FUZZING_GET_FILE_DETAILS: {
      return {
        ...state,
        activeFile: action.payload,
      };
    }

    case FUZZING_GET_FILE_DETAILS_SUCCESS: {
      return {
        ...state,
        activeFileDetails: action.payload,
      };
    }

    case FUZZING_SORT: {
      return {
        ...state,
        files: sortFiles(state.files, action.payload),
        sort: action.payload,
      }
    }

    case FUZZING_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortFiles(files: FuzzingFile[], tableSort: TableSort<FuzzingFile>): FuzzingFile[] {
  return sort(files, tableSort, ['path']);
}
