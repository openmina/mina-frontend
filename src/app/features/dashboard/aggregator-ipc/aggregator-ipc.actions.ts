import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { AggregatorIpc } from '@shared/types/dashboard/aggregator-ipc/aggregator-ipc.type';

enum AggregatorIpcActionTypes {
  AGGREGATOR_IPC_INIT = 'AGGREGATOR_IPC_INIT',
  AGGREGATOR_IPC_CLOSE = 'AGGREGATOR_IPC_CLOSE',
  AGGREGATOR_IPC_GET_MESSAGES = 'AGGREGATOR_IPC_GET_MESSAGES',
  AGGREGATOR_IPC_GET_MESSAGES_SUCCESS = 'AGGREGATOR_IPC_GET_MESSAGES_SUCCESS',
  AGGREGATOR_IPC_SET_ACTIVE_BLOCK = 'AGGREGATOR_IPC_SET_ACTIVE_BLOCK',
  AGGREGATOR_IPC_GET_EARLIEST_BLOCK = 'AGGREGATOR_IPC_GET_EARLIEST_BLOCK',
  AGGREGATOR_IPC_SET_EARLIEST_BLOCK = 'AGGREGATOR_IPC_SET_EARLIEST_BLOCK',
  AGGREGATOR_IPC_TOGGLE_SIDE_PANEL = 'AGGREGATOR_IPC_TOGGLE_SIDE_PANEL',
  AGGREGATOR_IPC_SORT = 'AGGREGATOR_IPC_SORT',
  AGGREGATOR_IPC_TOGGLE_FILTER = 'AGGREGATOR_IPC_TOGGLE_FILTER',
  AGGREGATOR_IPC_UPDATE_NODE_COUNT = 'AGGREGATOR_IPC_UPDATE_NODE_COUNT',
}

export const AGGREGATOR_IPC_INIT = AggregatorIpcActionTypes.AGGREGATOR_IPC_INIT;
export const AGGREGATOR_IPC_CLOSE = AggregatorIpcActionTypes.AGGREGATOR_IPC_CLOSE;
export const AGGREGATOR_IPC_GET_MESSAGES = AggregatorIpcActionTypes.AGGREGATOR_IPC_GET_MESSAGES;
export const AGGREGATOR_IPC_GET_MESSAGES_SUCCESS = AggregatorIpcActionTypes.AGGREGATOR_IPC_GET_MESSAGES_SUCCESS;
export const AGGREGATOR_IPC_SET_ACTIVE_BLOCK = AggregatorIpcActionTypes.AGGREGATOR_IPC_SET_ACTIVE_BLOCK;
export const AGGREGATOR_IPC_GET_EARLIEST_BLOCK = AggregatorIpcActionTypes.AGGREGATOR_IPC_GET_EARLIEST_BLOCK;
export const AGGREGATOR_IPC_SET_EARLIEST_BLOCK = AggregatorIpcActionTypes.AGGREGATOR_IPC_SET_EARLIEST_BLOCK;
export const AGGREGATOR_IPC_TOGGLE_SIDE_PANEL = AggregatorIpcActionTypes.AGGREGATOR_IPC_TOGGLE_SIDE_PANEL;
export const AGGREGATOR_IPC_SORT = AggregatorIpcActionTypes.AGGREGATOR_IPC_SORT;
export const AGGREGATOR_IPC_TOGGLE_FILTER = AggregatorIpcActionTypes.AGGREGATOR_IPC_TOGGLE_FILTER;
export const AGGREGATOR_IPC_UPDATE_NODE_COUNT = AggregatorIpcActionTypes.AGGREGATOR_IPC_UPDATE_NODE_COUNT;

export interface AggregatorIpcAction extends FeatureAction<AggregatorIpcActionTypes> {
  readonly type: AggregatorIpcActionTypes;
}

export class AggregatorIpcInit implements AggregatorIpcAction {
  readonly type = AGGREGATOR_IPC_INIT;
}

export class AggregatorIpcClose implements AggregatorIpcAction {
  readonly type = AGGREGATOR_IPC_CLOSE;
}

export class AggregatorIpcGetMessages implements AggregatorIpcAction {
  readonly type = AGGREGATOR_IPC_GET_MESSAGES;

  constructor(public payload?: { height: number }) {}
}

export class AggregatorIpcGetMessagesSuccess implements AggregatorIpcAction {
  readonly type = AGGREGATOR_IPC_GET_MESSAGES_SUCCESS;

  constructor(public payload: AggregatorIpc[]) {}
}

export class AggregatorIpcSetActiveBlock implements AggregatorIpcAction {
  readonly type = AGGREGATOR_IPC_SET_ACTIVE_BLOCK;

  constructor(public payload: { height: number, fetchNew?: boolean }) { }
}

export class AggregatorIpcGetEarliestBlock implements AggregatorIpcAction {
  readonly type = AGGREGATOR_IPC_GET_EARLIEST_BLOCK;
}

export class AggregatorIpcSetEarliestBlock implements AggregatorIpcAction {
  readonly type = AGGREGATOR_IPC_SET_EARLIEST_BLOCK;

  constructor(public payload: { height: number }) { }
}

export class AggregatorIpcSort implements AggregatorIpcAction {
  readonly type = AGGREGATOR_IPC_SORT;

  constructor(public payload: TableSort<AggregatorIpc>) { }
}

export class AggregatorIpcToggleFilter implements AggregatorIpcAction {
  readonly type = AGGREGATOR_IPC_TOGGLE_FILTER;

  constructor(public payload: string) { }
}

export class AggregatorIpcUpdateNodeCount implements AggregatorIpcAction {
  readonly type = AGGREGATOR_IPC_UPDATE_NODE_COUNT;

  constructor(public payload: number) { }
}


export type AggregatorIpcActions =
  | AggregatorIpcInit
  | AggregatorIpcClose
  | AggregatorIpcGetMessages
  | AggregatorIpcGetMessagesSuccess
  | AggregatorIpcSetActiveBlock
  | AggregatorIpcGetEarliestBlock
  | AggregatorIpcSetEarliestBlock
  | AggregatorIpcSort
  | AggregatorIpcToggleFilter
  | AggregatorIpcUpdateNodeCount
  ;
