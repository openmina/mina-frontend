import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { DswBootstrapNode } from '@shared/types/dsw/bootstrap/dsw-bootstrap-node.type';

enum DswBootstrapActionTypes {
  DSW_BOOTSTRAP_GET_BLOCKS = 'DSW_BOOTSTRAP_GET_BLOCKS',
  DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS = 'DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS',
  DSW_BOOTSTRAP_SORT_BLOCKS = 'DSW_BOOTSTRAP_SORT_BLOCKS',
  DSW_BOOTSTRAP_SET_ACTIVE_BLOCK = 'DSW_BOOTSTRAP_SET_ACTIVE_BLOCK',
  DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL = 'DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL',
  DSW_BOOTSTRAP_CLOSE = 'DSW_BOOTSTRAP_CLOSE',
}

export const DSW_BOOTSTRAP_GET_BLOCKS = DswBootstrapActionTypes.DSW_BOOTSTRAP_GET_BLOCKS;
export const DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS = DswBootstrapActionTypes.DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS;
export const DSW_BOOTSTRAP_SORT_BLOCKS = DswBootstrapActionTypes.DSW_BOOTSTRAP_SORT_BLOCKS;
export const DSW_BOOTSTRAP_SET_ACTIVE_BLOCK = DswBootstrapActionTypes.DSW_BOOTSTRAP_SET_ACTIVE_BLOCK;
export const DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL = DswBootstrapActionTypes.DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL;
export const DSW_BOOTSTRAP_CLOSE = DswBootstrapActionTypes.DSW_BOOTSTRAP_CLOSE;

export interface DswBootstrapAction extends FeatureAction<DswBootstrapActionTypes> {
  readonly type: DswBootstrapActionTypes;
}

export class DswBootstrapGetBlocks implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_GET_BLOCKS;
}

export class DswBootstrapGetBlocksSuccess implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS;

  constructor(public payload: DswBootstrapNode[]) { }
}

export class DswBootstrapSortBlocks implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_SORT_BLOCKS;

  constructor(public payload: TableSort<DswBootstrapNode>) { }
}

export class DswBootstrapSetActiveBlock implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_SET_ACTIVE_BLOCK;

  constructor(public payload: DswBootstrapNode) { }
}

export class DswBootstrapToggleSidePanel implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL;
}

export class DswBootstrapClose implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_CLOSE;
}

export type DswBootstrapActions =
  | DswBootstrapGetBlocks
  | DswBootstrapGetBlocksSuccess
  | DswBootstrapSortBlocks
  | DswBootstrapSetActiveBlock
  | DswBootstrapToggleSidePanel
  | DswBootstrapClose
  ;
