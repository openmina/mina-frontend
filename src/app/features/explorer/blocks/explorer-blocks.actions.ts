import { FeatureAction } from '@shared/types/store/feature-action.type';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ExplorerBlockTx } from '@shared/types/explorer/blocks/explorer-block-tx.type';
import { ExplorerBlockZkApp } from '@shared/types/explorer/blocks/explorer-block-zk-app-type';

enum ExplorerBlocksActionTypes {
  EXPLORER_BLOCKS_INIT = 'EXPLORER_BLOCKS_INIT',
  EXPLORER_BLOCKS_CLOSE = 'EXPLORER_BLOCKS_CLOSE',
  EXPLORER_BLOCKS_GET_BLOCKS = 'EXPLORER_BLOCKS_GET_BLOCKS',
  EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS = 'EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS',
  EXPLORER_BLOCKS_SORT = 'EXPLORER_BLOCKS_SORT',
  EXPLORER_BLOCKS_SET_ACTIVE_BLOCK = 'EXPLORER_BLOCKS_SET_ACTIVE_BLOCK',
  EXPLORER_BLOCKS_GET_TXS = 'EXPLORER_BLOCKS_GET_TXS',
  EXPLORER_BLOCKS_GET_TXS_SUCCESS = 'EXPLORER_BLOCKS_GET_TXS_SUCCESS',
  EXPLORER_BLOCKS_SET_ACTIVE_ZK_APP = 'EXPLORER_BLOCKS_SET_ACTIVE_ZK_APP',
  EXPLORER_BLOCKS_SORT_ZK_APPS = 'EXPLORER_BLOCKS_SORT_ZK_APPS',
}

export const EXPLORER_BLOCKS_INIT = ExplorerBlocksActionTypes.EXPLORER_BLOCKS_INIT;
export const EXPLORER_BLOCKS_CLOSE = ExplorerBlocksActionTypes.EXPLORER_BLOCKS_CLOSE;
export const EXPLORER_BLOCKS_GET_BLOCKS = ExplorerBlocksActionTypes.EXPLORER_BLOCKS_GET_BLOCKS;
export const EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS = ExplorerBlocksActionTypes.EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS;
export const EXPLORER_BLOCKS_SORT = ExplorerBlocksActionTypes.EXPLORER_BLOCKS_SORT;
export const EXPLORER_BLOCKS_SET_ACTIVE_BLOCK = ExplorerBlocksActionTypes.EXPLORER_BLOCKS_SET_ACTIVE_BLOCK;
export const EXPLORER_BLOCKS_GET_TXS = ExplorerBlocksActionTypes.EXPLORER_BLOCKS_GET_TXS;
export const EXPLORER_BLOCKS_GET_TXS_SUCCESS = ExplorerBlocksActionTypes.EXPLORER_BLOCKS_GET_TXS_SUCCESS;
export const EXPLORER_BLOCKS_SET_ACTIVE_ZK_APP = ExplorerBlocksActionTypes.EXPLORER_BLOCKS_SET_ACTIVE_ZK_APP;
export const EXPLORER_BLOCKS_SORT_ZK_APPS = ExplorerBlocksActionTypes.EXPLORER_BLOCKS_SORT_ZK_APPS;

export interface ExplorerBlocksAction extends FeatureAction<ExplorerBlocksActionTypes> {
  readonly type: ExplorerBlocksActionTypes;
}

export class ExplorerBlocksInit implements ExplorerBlocksAction {
  readonly type = EXPLORER_BLOCKS_INIT;
}

export class ExplorerBlocksClose implements ExplorerBlocksAction {
  readonly type = EXPLORER_BLOCKS_CLOSE;
}

export class ExplorerBlocksGetBlocks implements ExplorerBlocksAction {
  readonly type = EXPLORER_BLOCKS_GET_BLOCKS;

  constructor(public payload?: { height: number }) {}
}

export class ExplorerBlocksGetBlocksSuccess implements ExplorerBlocksAction {
  readonly type = EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS;

  constructor(public payload: ExplorerBlock[]) {}
}

export class ExplorerBlocksSort implements ExplorerBlocksAction {
  readonly type = EXPLORER_BLOCKS_SORT;

  constructor(public payload: TableSort<ExplorerBlock>) { }
}

export class ExplorerBlocksSetActiveBlock implements ExplorerBlocksAction {
  readonly type = EXPLORER_BLOCKS_SET_ACTIVE_BLOCK;

  constructor(public payload: ExplorerBlock) { }
}

export class ExplorerBlocksGetTxs implements ExplorerBlocksAction {
  readonly type = EXPLORER_BLOCKS_GET_TXS;
}

export class ExplorerBlocksGetTxsSuccess implements ExplorerBlocksAction {
  readonly type = EXPLORER_BLOCKS_GET_TXS_SUCCESS;

  constructor(public payload: [ExplorerBlockTx[], ExplorerBlockZkApp[]]) { }
}

export class ExplorerBlocksSetActiveZkApp implements ExplorerBlocksAction {
  readonly type = EXPLORER_BLOCKS_SET_ACTIVE_ZK_APP;

  constructor(public payload: ExplorerBlockZkApp) { }
}

export class ExplorerBlocksSortZkApps implements ExplorerBlocksAction {
  readonly type = EXPLORER_BLOCKS_SORT_ZK_APPS;

  constructor(public payload: TableSort<ExplorerBlockZkApp>) { }
}


export type ExplorerBlocksActions =
  | ExplorerBlocksInit
  | ExplorerBlocksClose
  | ExplorerBlocksGetBlocks
  | ExplorerBlocksGetBlocksSuccess
  | ExplorerBlocksSort
  | ExplorerBlocksSetActiveBlock
  | ExplorerBlocksGetTxs
  | ExplorerBlocksGetTxsSuccess
  | ExplorerBlocksSetActiveZkApp
  | ExplorerBlocksSortZkApps
  ;
