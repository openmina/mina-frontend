import { DashboardMessage } from '@shared/types/dashboard/dashboard-message';
import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

enum AggregatorActionTypes {
  AGGREGATOR_INIT = 'AGGREGATOR_INIT',
  AGGREGATOR_CLOSE = 'AGGREGATOR_CLOSE',
  AGGREGATOR_GET_MESSAGES = 'AGGREGATOR_GET_MESSAGES',
  AGGREGATOR_GET_MESSAGES_SUCCESS = 'AGGREGATOR_GET_MESSAGES_SUCCESS',
  AGGREGATOR_SET_ACTIVE_BLOCK = 'AGGREGATOR_SET_ACTIVE_BLOCK',
  AGGREGATOR_GET_EARLIEST_BLOCK = 'AGGREGATOR_GET_EARLIEST_BLOCK',
  AGGREGATOR_SET_EARLIEST_BLOCK = 'AGGREGATOR_SET_EARLIEST_BLOCK',
  AGGREGATOR_TOGGLE_SIDE_PANEL = 'AGGREGATOR_TOGGLE_SIDE_PANEL',
  AGGREGATOR_SORT = 'AGGREGATOR_SORT',
  AGGREGATOR_TOGGLE_FILTER = 'AGGREGATOR_TOGGLE_FILTER',
  AGGREGATOR_UPDATE_NODE_COUNT = 'AGGREGATOR_UPDATE_NODE_COUNT',
}

export const AGGREGATOR_INIT = AggregatorActionTypes.AGGREGATOR_INIT;
export const AGGREGATOR_CLOSE = AggregatorActionTypes.AGGREGATOR_CLOSE;
export const AGGREGATOR_GET_MESSAGES = AggregatorActionTypes.AGGREGATOR_GET_MESSAGES;
export const AGGREGATOR_GET_MESSAGES_SUCCESS = AggregatorActionTypes.AGGREGATOR_GET_MESSAGES_SUCCESS;
export const AGGREGATOR_SET_ACTIVE_BLOCK = AggregatorActionTypes.AGGREGATOR_SET_ACTIVE_BLOCK;
export const AGGREGATOR_GET_EARLIEST_BLOCK = AggregatorActionTypes.AGGREGATOR_GET_EARLIEST_BLOCK;
export const AGGREGATOR_SET_EARLIEST_BLOCK = AggregatorActionTypes.AGGREGATOR_SET_EARLIEST_BLOCK;
export const AGGREGATOR_TOGGLE_SIDE_PANEL = AggregatorActionTypes.AGGREGATOR_TOGGLE_SIDE_PANEL;
export const AGGREGATOR_SORT = AggregatorActionTypes.AGGREGATOR_SORT;
export const AGGREGATOR_TOGGLE_FILTER = AggregatorActionTypes.AGGREGATOR_TOGGLE_FILTER;
export const AGGREGATOR_UPDATE_NODE_COUNT = AggregatorActionTypes.AGGREGATOR_UPDATE_NODE_COUNT;

export interface AggregatorAction extends FeatureAction<AggregatorActionTypes> {
  readonly type: AggregatorActionTypes;
}

export class AggregatorInit implements AggregatorAction {
  readonly type = AGGREGATOR_INIT;
}

export class AggregatorClose implements AggregatorAction {
  readonly type = AGGREGATOR_CLOSE;
}

export class AggregatorGetMessages implements AggregatorAction {
  readonly type = AGGREGATOR_GET_MESSAGES;

  constructor(public payload?: { height: number }) {}
}

export class AggregatorGetMessagesSuccess implements AggregatorAction {
  readonly type = AGGREGATOR_GET_MESSAGES_SUCCESS;

  constructor(public payload: DashboardMessage[]) {}
}

export class AggregatorSetActiveBlock implements AggregatorAction {
  readonly type = AGGREGATOR_SET_ACTIVE_BLOCK;

  constructor(public payload: { height: number, fetchNew?: boolean }) { }
}

export class AggregatorToggleSidePanel implements AggregatorAction {
  readonly type = AGGREGATOR_TOGGLE_SIDE_PANEL;
}

export class AggregatorGetEarliestBlock implements AggregatorAction {
  readonly type = AGGREGATOR_GET_EARLIEST_BLOCK;
}

export class AggregatorSetEarliestBlock implements AggregatorAction {
  readonly type = AGGREGATOR_SET_EARLIEST_BLOCK;

  constructor(public payload: { height: number }) { }
}

export class AggregatorSort implements AggregatorAction {
  readonly type = AGGREGATOR_SORT;

  constructor(public payload: TableSort<DashboardMessage>) { }
}

export class AggregatorToggleFilter implements AggregatorAction {
  readonly type = AGGREGATOR_TOGGLE_FILTER;

  constructor(public payload: string) { }
}

export class AggregatorUpdateNodeCount implements AggregatorAction {
  readonly type = AGGREGATOR_UPDATE_NODE_COUNT;

  constructor(public payload: number) { }
}


export type AggregatorActions =
  | AggregatorInit
  | AggregatorClose
  | AggregatorGetMessages
  | AggregatorGetMessagesSuccess
  | AggregatorSetActiveBlock
  | AggregatorToggleSidePanel
  | AggregatorGetEarliestBlock
  | AggregatorSetEarliestBlock
  | AggregatorSort
  | AggregatorToggleFilter
  | AggregatorUpdateNodeCount
  ;
