import { FeatureAction } from '@shared/types/store/feature-action.type';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';

enum NetworkBlocksActionTypes {
  NETWORK_BLOCKS_INIT = 'NETWORK_BLOCKS_INIT',
  NETWORK_BLOCKS_CLOSE = 'NETWORK_BLOCKS_CLOSE',
  NETWORK_BLOCKS_GET_BLOCKS = 'NETWORK_BLOCKS_GET_BLOCKS',
  NETWORK_BLOCKS_GET_BLOCKS_SUCCESS = 'NETWORK_BLOCKS_GET_BLOCKS_SUCCESS',
}

export const NETWORK_BLOCKS_INIT = NetworkBlocksActionTypes.NETWORK_BLOCKS_INIT;
export const NETWORK_BLOCKS_CLOSE = NetworkBlocksActionTypes.NETWORK_BLOCKS_CLOSE;
export const NETWORK_BLOCKS_GET_BLOCKS = NetworkBlocksActionTypes.NETWORK_BLOCKS_GET_BLOCKS;
export const NETWORK_BLOCKS_GET_BLOCKS_SUCCESS = NetworkBlocksActionTypes.NETWORK_BLOCKS_GET_BLOCKS_SUCCESS;

export interface NetworkBlocksAction extends FeatureAction<NetworkBlocksActionTypes> {
  readonly type: NetworkBlocksActionTypes;
}

export class NetworkBlocksInit implements NetworkBlocksAction {
  readonly type = NETWORK_BLOCKS_INIT;
}

export class NetworkBlocksClose implements NetworkBlocksAction {
  readonly type = NETWORK_BLOCKS_CLOSE;
}

export class NetworkBlocksGetBlocks implements NetworkBlocksAction {
  readonly type = NETWORK_BLOCKS_GET_BLOCKS;
}

export class NetworkBlocksGetBlocksSuccess implements NetworkBlocksAction {
  readonly type = NETWORK_BLOCKS_GET_BLOCKS_SUCCESS;

  constructor(public payload: NetworkBlock[]) {}
}


export type NetworkBlocksActions =
  | NetworkBlocksInit
  | NetworkBlocksClose
  | NetworkBlocksGetBlocks
  | NetworkBlocksGetBlocksSuccess
  ;
