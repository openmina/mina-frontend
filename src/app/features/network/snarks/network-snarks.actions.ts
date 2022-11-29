import { FeatureAction } from '@shared/types/store/feature-action.type';
import { NetworkSnark } from '@shared/types/network/snarks/network-snark';

enum NetworkSnarksActionTypes {
  NETWORK_SNARKS_INIT = 'NETWORK_SNARKS_INIT',
  NETWORK_SNARKS_CLOSE = 'NETWORK_SNARKS_CLOSE',
  NETWORK_SNARKS_GET_SNARKS = 'NETWORK_SNARKS_GET_SNARKS',
  NETWORK_SNARKS_GET_SNARKS_SUCCESS = 'NETWORK_SNARKS_GET_SNARKS_SUCCESS',
  NETWORK_SNARKS_SELECT_SNARK = 'NETWORK_SNARKS_SELECT_SNARK',
  NETWORK_SNARKS_GO_LIVE = 'NETWORK_SNARKS_GO_LIVE',
  NETWORK_SNARKS_PAUSE = 'NETWORK_SNARKS_PAUSE',
}

export const NETWORK_SNARKS_INIT = NetworkSnarksActionTypes.NETWORK_SNARKS_INIT;
export const NETWORK_SNARKS_CLOSE = NetworkSnarksActionTypes.NETWORK_SNARKS_CLOSE;
export const NETWORK_SNARKS_GET_SNARKS = NetworkSnarksActionTypes.NETWORK_SNARKS_GET_SNARKS;
export const NETWORK_SNARKS_GET_SNARKS_SUCCESS = NetworkSnarksActionTypes.NETWORK_SNARKS_GET_SNARKS_SUCCESS;
export const NETWORK_SNARKS_SELECT_SNARK = NetworkSnarksActionTypes.NETWORK_SNARKS_SELECT_SNARK;
export const NETWORK_SNARKS_GO_LIVE = NetworkSnarksActionTypes.NETWORK_SNARKS_GO_LIVE;
export const NETWORK_SNARKS_PAUSE = NetworkSnarksActionTypes.NETWORK_SNARKS_PAUSE;

export interface NetworkSnarksAction extends FeatureAction<NetworkSnarksActionTypes> {
  readonly type: NetworkSnarksActionTypes;
}

export class NetworkSnarksInit implements NetworkSnarksAction {
  readonly type = NETWORK_SNARKS_INIT;
}

export class NetworkSnarksClose implements NetworkSnarksAction {
  readonly type = NETWORK_SNARKS_CLOSE;
}

export class NetworkSnarksGetSnarks implements NetworkSnarksAction {
  readonly type = NETWORK_SNARKS_GET_SNARKS;
}

export class NetworkSnarksGetSnarksSuccess implements NetworkSnarksAction {
  readonly type = NETWORK_SNARKS_GET_SNARKS_SUCCESS;

  constructor(public payload: NetworkSnark[]) {}
}

export class NetworkSnarksSelectSnark implements NetworkSnarksAction {
  readonly type = NETWORK_SNARKS_SELECT_SNARK;

  constructor(public payload: NetworkSnark) {}
}

export class NetworkSnarksGoLive implements NetworkSnarksAction {
  readonly type = NETWORK_SNARKS_GO_LIVE;
}

export class NetworkSnarksPause implements NetworkSnarksAction {
  readonly type = NETWORK_SNARKS_PAUSE;
}

export type NetworkSnarksActions =
  | NetworkSnarksInit
  | NetworkSnarksClose
  | NetworkSnarksGetSnarks
  | NetworkSnarksGetSnarksSuccess
  | NetworkSnarksSelectSnark
  | NetworkSnarksGoLive
  | NetworkSnarksPause
  ;
