import { FeatureAction } from '@shared/types/store/feature-action.type';
import { ExplorerScanStateTree } from '@shared/types/explorer/scan-state/explorer-scan-state-tree.type';
import { ExplorerScanStateResponse } from '@shared/types/explorer/scan-state/explorer-scan-state-response.type';

enum ExplorerScanStateActionTypes {
  EXPLORER_SCAN_STATE_CLOSE = 'EXPLORER_SCAN_STATE_CLOSE',
  EXPLORER_SCAN_STATE_GET_SCAN_STATE = 'EXPLORER_SCAN_STATE_GET_SCAN_STATE',
  EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS = 'EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS',
  EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK = 'EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK',
  EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK = 'EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK',
  EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING = 'EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING',
  EXPLORER_SCAN_STATE_CENTER_TREES = 'EXPLORER_SCAN_STATE_CENTER_TREES',
}

export const EXPLORER_SCAN_STATE_CLOSE = ExplorerScanStateActionTypes.EXPLORER_SCAN_STATE_CLOSE;
export const EXPLORER_SCAN_STATE_GET_SCAN_STATE = ExplorerScanStateActionTypes.EXPLORER_SCAN_STATE_GET_SCAN_STATE;
export const EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS = ExplorerScanStateActionTypes.EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS;
export const EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK = ExplorerScanStateActionTypes.EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK;
export const EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK = ExplorerScanStateActionTypes.EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK;
export const EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING = ExplorerScanStateActionTypes.EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING;
export const EXPLORER_SCAN_STATE_CENTER_TREES = ExplorerScanStateActionTypes.EXPLORER_SCAN_STATE_CENTER_TREES;

export interface ExplorerScanStateAction extends FeatureAction<ExplorerScanStateActionTypes> {
  readonly type: ExplorerScanStateActionTypes;
}

export class ExplorerScanStateClose implements ExplorerScanStateAction {
  readonly type = EXPLORER_SCAN_STATE_CLOSE;
}

export class ExplorerScanStateGetScanState implements ExplorerScanStateAction {
  readonly type = EXPLORER_SCAN_STATE_GET_SCAN_STATE;

  constructor(public payload: { height: number }) {}
}

export class ExplorerScanStateGetScanStateSuccess implements ExplorerScanStateAction {
  readonly type = EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS;

  constructor(public payload: ExplorerScanStateResponse) {}
}

export class ExplorerScanStateSetActiveBlock implements ExplorerScanStateAction {
  readonly type = EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK;

  constructor(public payload: { height: number }) { }
}

export class ExplorerScanStateSetEarliestBlock implements ExplorerScanStateAction {
  readonly type = EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK;

  constructor(public payload: { height: number }) { }
}

export class ExplorerScanStateToggleLeafsMarking implements ExplorerScanStateAction {
  readonly type = EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING;
}

export class ExplorerScanStateCenterTrees implements ExplorerScanStateAction {
  readonly type = EXPLORER_SCAN_STATE_CENTER_TREES;
}

export type ExplorerScanStateActions =
  | ExplorerScanStateClose
  | ExplorerScanStateGetScanState
  | ExplorerScanStateGetScanStateSuccess
  | ExplorerScanStateSetActiveBlock
  | ExplorerScanStateSetEarliestBlock
  | ExplorerScanStateToggleLeafsMarking
  | ExplorerScanStateCenterTrees
  ;
