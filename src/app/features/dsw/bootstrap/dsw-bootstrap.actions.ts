import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { DswBootstrapNode } from '@shared/types/dsw/bootstrap/dsw-bootstrap-node.type';

enum DswBootstrapActionTypes {
  DSW_BOOTSTRAP_INIT = 'DSW_BOOTSTRAP_INIT',
  DSW_BOOTSTRAP_INIT_SUCCESS = 'DSW_BOOTSTRAP_INIT_SUCCESS',
  DSW_BOOTSTRAP_GET_NODES = 'DSW_BOOTSTRAP_GET_NODES',
  DSW_BOOTSTRAP_GET_NODES_SUCCESS = 'DSW_BOOTSTRAP_GET_NODES_SUCCESS',
  DSW_BOOTSTRAP_SORT_NODES = 'DSW_BOOTSTRAP_SORT_NODES',
  DSW_BOOTSTRAP_SET_ACTIVE_BLOCK = 'DSW_BOOTSTRAP_SET_ACTIVE_BLOCK',
  DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL = 'DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL',
  DSW_BOOTSTRAP_CLOSE = 'DSW_BOOTSTRAP_CLOSE',
}

export const DSW_BOOTSTRAP_INIT = DswBootstrapActionTypes.DSW_BOOTSTRAP_INIT;
export const DSW_BOOTSTRAP_INIT_SUCCESS = DswBootstrapActionTypes.DSW_BOOTSTRAP_INIT_SUCCESS;
export const DSW_BOOTSTRAP_GET_NODES = DswBootstrapActionTypes.DSW_BOOTSTRAP_GET_NODES;
export const DSW_BOOTSTRAP_GET_NODES_SUCCESS = DswBootstrapActionTypes.DSW_BOOTSTRAP_GET_NODES_SUCCESS;
export const DSW_BOOTSTRAP_SORT_NODES = DswBootstrapActionTypes.DSW_BOOTSTRAP_SORT_NODES;
export const DSW_BOOTSTRAP_SET_ACTIVE_BLOCK = DswBootstrapActionTypes.DSW_BOOTSTRAP_SET_ACTIVE_BLOCK;
export const DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL = DswBootstrapActionTypes.DSW_BOOTSTRAP_TOGGLE_SIDE_PANEL;
export const DSW_BOOTSTRAP_CLOSE = DswBootstrapActionTypes.DSW_BOOTSTRAP_CLOSE;

export interface DswBootstrapAction extends FeatureAction<DswBootstrapActionTypes> {
  readonly type: DswBootstrapActionTypes;
}

export class DswBootstrapInit implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_INIT;
}

export class DswBootstrapInitSuccess implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_INIT_SUCCESS;
}

export class DswBootstrapGetNodes implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_GET_NODES;

  constructor(public payload?: { force?: boolean }) { }
}

export class DswBootstrapGetNodesSuccess implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_GET_NODES_SUCCESS;

  constructor(public payload: DswBootstrapNode[]) { }
}

export class DswBootstrapSortNodes implements DswBootstrapAction {
  readonly type = DSW_BOOTSTRAP_SORT_NODES;

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
  | DswBootstrapInit
  | DswBootstrapInitSuccess
  | DswBootstrapGetNodes
  | DswBootstrapGetNodesSuccess
  | DswBootstrapSortNodes
  | DswBootstrapSetActiveBlock
  | DswBootstrapToggleSidePanel
  | DswBootstrapClose
  ;
