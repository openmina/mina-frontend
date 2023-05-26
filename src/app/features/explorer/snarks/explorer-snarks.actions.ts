import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ExplorerSnark } from '@shared/types/explorer/snarks/explorer-snarks.type';

enum ExplorerSnarksActionTypes {
  EXPLORER_SNARKS_INIT = 'EXPLORER_SNARKS_INIT',
  EXPLORER_SNARKS_CLOSE = 'EXPLORER_SNARKS_CLOSE',
  EXPLORER_SNARKS_GET_SNARKS = 'EXPLORER_SNARKS_GET_SNARKS',
  EXPLORER_SNARKS_GET_SNARKS_SUCCESS = 'EXPLORER_SNARKS_GET_SNARKS_SUCCESS',
  EXPLORER_SNARKS_SORT = 'EXPLORER_SNARKS_SORT',
  EXPLORER_SNARKS_SET_ACTIVE_SNARK = 'EXPLORER_SNARKS_SET_ACTIVE_SNARK',
}

export const EXPLORER_SNARKS_INIT = ExplorerSnarksActionTypes.EXPLORER_SNARKS_INIT;
export const EXPLORER_SNARKS_CLOSE = ExplorerSnarksActionTypes.EXPLORER_SNARKS_CLOSE;
export const EXPLORER_SNARKS_GET_SNARKS = ExplorerSnarksActionTypes.EXPLORER_SNARKS_GET_SNARKS;
export const EXPLORER_SNARKS_GET_SNARKS_SUCCESS = ExplorerSnarksActionTypes.EXPLORER_SNARKS_GET_SNARKS_SUCCESS;
export const EXPLORER_SNARKS_SORT = ExplorerSnarksActionTypes.EXPLORER_SNARKS_SORT;
export const EXPLORER_SNARKS_SET_ACTIVE_SNARK = ExplorerSnarksActionTypes.EXPLORER_SNARKS_SET_ACTIVE_SNARK;

export interface ExplorerSnarksAction extends FeatureAction<ExplorerSnarksActionTypes> {
  readonly type: ExplorerSnarksActionTypes;
}

export class ExplorerSnarksInit implements ExplorerSnarksAction {
  readonly type = EXPLORER_SNARKS_INIT;
}

export class ExplorerSnarksClose implements ExplorerSnarksAction {
  readonly type = EXPLORER_SNARKS_CLOSE;
}

export class ExplorerSnarksGetSnarks implements ExplorerSnarksAction {
  readonly type = EXPLORER_SNARKS_GET_SNARKS;

  constructor(public payload?: { height: number }) {}
}

export class ExplorerSnarksGetSnarksSuccess implements ExplorerSnarksAction {
  readonly type = EXPLORER_SNARKS_GET_SNARKS_SUCCESS;

  constructor(public payload: ExplorerSnark[]) {}
}

export class ExplorerSnarksSort implements ExplorerSnarksAction {
  readonly type = EXPLORER_SNARKS_SORT;

  constructor(public payload: TableSort<ExplorerSnark>) { }
}

export class ExplorerSnarksSetActiveSnark implements ExplorerSnarksAction {
  readonly type = EXPLORER_SNARKS_SET_ACTIVE_SNARK;

  constructor(public payload: ExplorerSnark) { }
}

export type ExplorerSnarksActions =
  | ExplorerSnarksInit
  | ExplorerSnarksClose
  | ExplorerSnarksGetSnarks
  | ExplorerSnarksGetSnarksSuccess
  | ExplorerSnarksSort
  | ExplorerSnarksSetActiveSnark
  ;
