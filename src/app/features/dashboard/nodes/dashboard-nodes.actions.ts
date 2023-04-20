import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { DashboardFork } from '@shared/types/dashboard/node-list/dashboard-fork.type';

enum DashboardNodesActionTypes {
  DASHBOARD_NODES_INIT = 'DASHBOARD_NODES_INIT',
  DASHBOARD_NODES_CLOSE = 'DASHBOARD_NODES_CLOSE',
  DASHBOARD_NODES_GET_NODES = 'DASHBOARD_NODES_GET_NODES',
  DASHBOARD_NODES_GET_NODE = 'DASHBOARD_NODES_GET_NODE',
  DASHBOARD_NODES_GET_NODE_SUCCESS = 'DASHBOARD_NODES_GET_NODE_SUCCESS',
  DASHBOARD_NODES_SORT = 'DASHBOARD_NODES_SORT',
  DASHBOARD_NODES_SET_ACTIVE_NODE = 'DASHBOARD_NODES_SET_ACTIVE_NODE',
  DASHBOARD_NODES_GET_TRACES_SUCCESS = 'DASHBOARD_NODES_GET_TRACES_SUCCESS',
  DASHBOARD_NODES_SET_ACTIVE_BLOCK = 'DASHBOARD_NODES_SET_ACTIVE_BLOCK',
  DASHBOARD_NODES_GET_EARLIEST_BLOCK = 'DASHBOARD_NODES_GET_EARLIEST_BLOCK',
  DASHBOARD_NODES_SET_EARLIEST_BLOCK = 'DASHBOARD_NODES_SET_EARLIEST_BLOCK',
  DASHBOARD_NODES_TOGGLE_FILTER = 'DASHBOARD_NODES_TOGGLE_FILTER',
  DASHBOARD_NODES_TOGGLE_NODES_SHOWING = 'DASHBOARD_NODES_TOGGLE_NODES_SHOWING',
  DASHBOARD_NODES_TOGGLE_LATENCY = 'DASHBOARD_NODES_TOGGLE_LATENCY',
  DASHBOARD_NODES_GET_FORKS = 'DASHBOARD_NODES_GET_FORKS',
  DASHBOARD_NODES_GET_FORKS_SUCCESS = 'DASHBOARD_NODES_GET_FORKS_SUCCESS',
  DASHBOARD_NODES_SPLIT_NODES = 'DASHBOARD_NODES_SPLIT_NODES',
}

export const DASHBOARD_NODES_INIT = DashboardNodesActionTypes.DASHBOARD_NODES_INIT;
export const DASHBOARD_NODES_CLOSE = DashboardNodesActionTypes.DASHBOARD_NODES_CLOSE;
export const DASHBOARD_NODES_GET_NODES = DashboardNodesActionTypes.DASHBOARD_NODES_GET_NODES;
export const DASHBOARD_NODES_GET_NODE = DashboardNodesActionTypes.DASHBOARD_NODES_GET_NODE;
export const DASHBOARD_NODES_GET_NODE_SUCCESS = DashboardNodesActionTypes.DASHBOARD_NODES_GET_NODE_SUCCESS;
export const DASHBOARD_NODES_SORT = DashboardNodesActionTypes.DASHBOARD_NODES_SORT;
export const DASHBOARD_NODES_SET_ACTIVE_NODE = DashboardNodesActionTypes.DASHBOARD_NODES_SET_ACTIVE_NODE;
export const DASHBOARD_NODES_GET_TRACES_SUCCESS = DashboardNodesActionTypes.DASHBOARD_NODES_GET_TRACES_SUCCESS;
export const DASHBOARD_NODES_SET_ACTIVE_BLOCK = DashboardNodesActionTypes.DASHBOARD_NODES_SET_ACTIVE_BLOCK;
export const DASHBOARD_NODES_GET_EARLIEST_BLOCK = DashboardNodesActionTypes.DASHBOARD_NODES_GET_EARLIEST_BLOCK;
export const DASHBOARD_NODES_SET_EARLIEST_BLOCK = DashboardNodesActionTypes.DASHBOARD_NODES_SET_EARLIEST_BLOCK;
export const DASHBOARD_NODES_TOGGLE_FILTER = DashboardNodesActionTypes.DASHBOARD_NODES_TOGGLE_FILTER;
export const DASHBOARD_NODES_TOGGLE_NODES_SHOWING = DashboardNodesActionTypes.DASHBOARD_NODES_TOGGLE_NODES_SHOWING;
export const DASHBOARD_NODES_TOGGLE_LATENCY = DashboardNodesActionTypes.DASHBOARD_NODES_TOGGLE_LATENCY;
export const DASHBOARD_NODES_GET_FORKS = DashboardNodesActionTypes.DASHBOARD_NODES_GET_FORKS;
export const DASHBOARD_NODES_GET_FORKS_SUCCESS = DashboardNodesActionTypes.DASHBOARD_NODES_GET_FORKS_SUCCESS;
export const DASHBOARD_NODES_SPLIT_NODES = DashboardNodesActionTypes.DASHBOARD_NODES_SPLIT_NODES;

export interface DashboardNodesAction extends FeatureAction<DashboardNodesActionTypes> {
  readonly type: DashboardNodesActionTypes;
}

export class DashboardNodesInit implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_INIT;
}

export class DashboardNodesClose implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_CLOSE;
}

export class DashboardNodesGetNodes implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_GET_NODES;

  constructor(public payload?: { height: number }) { }
}

export class DashboardNodesGetNode implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_GET_NODE;

  constructor(public payload: { node: DashboardNode, height: number }) { }
}

export class DashboardNodesGetNodeSuccess implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_GET_NODE_SUCCESS;

  constructor(public payload: DashboardNode[]) { }
}

export class DashboardNodesSort implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_SORT;

  constructor(public payload: TableSort<DashboardNode>) { }
}

export class DashboardNodesSetActiveNode implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_SET_ACTIVE_NODE;

  constructor(public payload: { node: DashboardNode }) { }
}

export class DashboardNodesGetTracesSuccess implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_GET_TRACES_SUCCESS;

  constructor(public payload: TracingTraceGroup[]) { }
}

export class DashboardNodesSetActiveBlock implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_SET_ACTIVE_BLOCK;

  constructor(public payload: { height: number, fetchNew?: boolean }) { }
}

export class DashboardNodesGetEarliestBlock implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_GET_EARLIEST_BLOCK;
}

export class DashboardNodesSetEarliestBlock implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_SET_EARLIEST_BLOCK;

  constructor(public payload: { height: number }) { }
}

export class DashboardNodesToggleFilter implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_TOGGLE_FILTER;

  constructor(public payload: { value: string, type: 'branch' | 'bestTip' }) { }
}

export class DashboardNodesToggleNodesShowing implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_TOGGLE_NODES_SHOWING;
}

export class DashboardNodesToggleLatency implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_TOGGLE_LATENCY;
}

export class DashboardNodesGetForks implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_GET_FORKS;
}

export class DashboardNodesGetForksSuccess implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_GET_FORKS_SUCCESS;

  constructor(public payload: DashboardFork[]) { }
}

export class DashboardNodesSplitNodes implements DashboardNodesAction {
  readonly type = DASHBOARD_NODES_SPLIT_NODES;
}


export type DashboardNodesActions =
  | DashboardNodesInit
  | DashboardNodesClose
  | DashboardNodesGetNodes
  | DashboardNodesGetNode
  | DashboardNodesGetNodeSuccess
  | DashboardNodesSort
  | DashboardNodesSetActiveNode
  | DashboardNodesGetTracesSuccess
  | DashboardNodesSetActiveBlock
  | DashboardNodesGetEarliestBlock
  | DashboardNodesSetEarliestBlock
  | DashboardNodesToggleFilter
  | DashboardNodesToggleNodesShowing
  | DashboardNodesToggleLatency
  | DashboardNodesGetForks
  | DashboardNodesGetForksSuccess
  | DashboardNodesSplitNodes;
  ;
