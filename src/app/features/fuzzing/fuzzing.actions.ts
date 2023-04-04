import { FeatureAction } from '@shared/types/store/feature-action.type';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import { FuzzingFileDetails } from '@shared/types/fuzzing/fuzzing-file-details.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

enum FuzzingActionTypes {
  FUZZING_INIT = 'FUZZING_INIT',
  FUZZING_CLOSE = 'FUZZING_CLOSE',
  FUZZING_GET_FILES = 'FUZZING_GET_FILES',
  FUZZING_GET_FILES_SUCCESS = 'FUZZING_GET_FILES_SUCCESS',
  FUZZING_GET_FILE_DETAILS = 'FUZZING_GET_FILE_DETAILS',
  FUZZING_GET_FILE_DETAILS_SUCCESS = 'FUZZING_GET_FILE_DETAILS_SUCCESS',
  FUZZING_SORT = 'FUZZING_SORT',
  FUZZING_FILTER = 'FUZZING_FILTER',
}

export const FUZZING_INIT = FuzzingActionTypes.FUZZING_INIT;
export const FUZZING_CLOSE = FuzzingActionTypes.FUZZING_CLOSE;
export const FUZZING_GET_FILES = FuzzingActionTypes.FUZZING_GET_FILES;
export const FUZZING_GET_FILES_SUCCESS = FuzzingActionTypes.FUZZING_GET_FILES_SUCCESS;
export const FUZZING_GET_FILE_DETAILS = FuzzingActionTypes.FUZZING_GET_FILE_DETAILS;
export const FUZZING_GET_FILE_DETAILS_SUCCESS = FuzzingActionTypes.FUZZING_GET_FILE_DETAILS_SUCCESS;
export const FUZZING_SORT = FuzzingActionTypes.FUZZING_SORT;
export const FUZZING_FILTER = FuzzingActionTypes.FUZZING_FILTER;

export interface FuzzingAction extends FeatureAction<FuzzingActionTypes> {
  readonly type: FuzzingActionTypes;
}

export class FuzzingInit implements FuzzingAction {
  readonly type = FUZZING_INIT;
}

export class FuzzingClose implements FuzzingAction {
  readonly type = FUZZING_CLOSE;
}

export class FuzzingGetFiles implements FuzzingAction {
  readonly type = FUZZING_GET_FILES;

  constructor(public payload: { urlType: 'ocaml' | 'rust' }) { }
}

export class FuzzingGetFilesSuccess implements FuzzingAction {
  readonly type = FUZZING_GET_FILES_SUCCESS;

  constructor(public payload: FuzzingFile[]) { }
}

export class FuzzingGetFileDetails implements FuzzingAction {
  readonly type = FUZZING_GET_FILE_DETAILS;

  constructor(public payload: FuzzingFile) { }
}

export class FuzzingGetFileDetailsSuccess implements FuzzingAction {
  readonly type = FUZZING_GET_FILE_DETAILS_SUCCESS;

  constructor(public payload: FuzzingFileDetails) { }
}

export class FuzzingSort implements FuzzingAction {
  readonly type = FUZZING_SORT;

  constructor(public payload: TableSort<FuzzingFile>) { }
}

export class FuzzingFilterFiles implements FuzzingAction {
  readonly type = FUZZING_FILTER;

  constructor(public payload: string) { }
}

export type FuzzingActions = FuzzingInit
  | FuzzingClose
  | FuzzingGetFiles
  | FuzzingGetFilesSuccess
  | FuzzingGetFileDetails
  | FuzzingGetFileDetailsSuccess
  | FuzzingSort
  | FuzzingFilterFiles
  ;
