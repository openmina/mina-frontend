import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { NetworkBlockIpc } from '@app/shared/types/network/blocks-ipc/network-block-ipc.type';

enum NetworkBlocksIpcActionTypes {
  NETWORK_BLOCKS_IPC_INIT = 'NETWORK_BLOCKS_IPC_INIT',
  NETWORK_BLOCKS_IPC_CLOSE = 'NETWORK_BLOCKS_IPC_CLOSE',
  NETWORK_BLOCKS_IPC_GET_BLOCKS = 'NETWORK_BLOCKS_IPC_GET_BLOCKS',
  NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS = 'NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS',
  NETWORK_BLOCKS_IPC_SORT = 'NETWORK_BLOCKS_IPC_SORT',
  NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL = 'NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL',
  NETWORK_BLOCKS_IPC_TOGGLE_FILTER = 'NETWORK_BLOCKS_IPC_TOGGLE_FILTER',
  NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK = 'NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK',
  NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK = 'NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK',
  NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK = 'NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK',
}

export const NETWORK_BLOCKS_IPC_INIT = NetworkBlocksIpcActionTypes.NETWORK_BLOCKS_IPC_INIT;
export const NETWORK_BLOCKS_IPC_CLOSE = NetworkBlocksIpcActionTypes.NETWORK_BLOCKS_IPC_CLOSE;
export const NETWORK_BLOCKS_IPC_GET_BLOCKS = NetworkBlocksIpcActionTypes.NETWORK_BLOCKS_IPC_GET_BLOCKS;
export const NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS = NetworkBlocksIpcActionTypes.NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS;
export const NETWORK_BLOCKS_IPC_SORT = NetworkBlocksIpcActionTypes.NETWORK_BLOCKS_IPC_SORT;
export const NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL = NetworkBlocksIpcActionTypes.NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL;
export const NETWORK_BLOCKS_IPC_TOGGLE_FILTER = NetworkBlocksIpcActionTypes.NETWORK_BLOCKS_IPC_TOGGLE_FILTER;
export const NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK = NetworkBlocksIpcActionTypes.NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK;
export const NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK = NetworkBlocksIpcActionTypes.NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK;
export const NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK = NetworkBlocksIpcActionTypes.NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK;

export interface NetworkBlocksIpcAction extends FeatureAction<NetworkBlocksIpcActionTypes> {
  readonly type: NetworkBlocksIpcActionTypes;
}

export class NetworkBlocksIpcInit implements NetworkBlocksIpcAction {
  readonly type = NETWORK_BLOCKS_IPC_INIT;
}

export class NetworkBlocksIpcClose implements NetworkBlocksIpcAction {
  readonly type = NETWORK_BLOCKS_IPC_CLOSE;
}

export class NetworkBlocksIpcGetBlocks implements NetworkBlocksIpcAction {
  readonly type = NETWORK_BLOCKS_IPC_GET_BLOCKS;

  constructor(public payload?: { height: number }) {}
}

export class NetworkBlocksIpcGetBlocksSuccess implements NetworkBlocksIpcAction {
  readonly type = NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS;

  constructor(public payload: NetworkBlockIpc[]) {}
}

export class NetworkBlocksIpcSort implements NetworkBlocksIpcAction {
  readonly type = NETWORK_BLOCKS_IPC_SORT;

  constructor(public payload: TableSort<NetworkBlockIpc>) { }
}

export class NetworkBlocksIpcToggleSidePanel implements NetworkBlocksIpcAction {
  readonly type = NETWORK_BLOCKS_IPC_TOGGLE_SIDE_PANEL;
}

export class NetworkBlocksIpcToggleFilter implements NetworkBlocksIpcAction {
  readonly type = NETWORK_BLOCKS_IPC_TOGGLE_FILTER;

  constructor(public payload: string) { }
}

export class NetworkBlocksIpcSetActiveBlock implements NetworkBlocksIpcAction {
  readonly type = NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK;

  constructor(public payload: { height: number, fetchNew?: boolean }) { }
}

export class NetworkBlocksIpcGetEarliestBlock implements NetworkBlocksIpcAction {
  readonly type = NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK;

  constructor(public payload: NodeStatus) { }
}

export class NetworkBlocksIpcSetEarliestBlock implements NetworkBlocksIpcAction {
  readonly type = NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK;

  constructor(public payload: { height: number }) { }
}


export type NetworkBlocksIpcActions =
  | NetworkBlocksIpcInit
  | NetworkBlocksIpcClose
  | NetworkBlocksIpcGetBlocks
  | NetworkBlocksIpcGetBlocksSuccess
  | NetworkBlocksIpcSort
  | NetworkBlocksIpcToggleSidePanel
  | NetworkBlocksIpcToggleFilter
  | NetworkBlocksIpcSetActiveBlock
  | NetworkBlocksIpcGetEarliestBlock
  | NetworkBlocksIpcSetEarliestBlock
  ;
