import { NetworkGlobal } from '@app/shared/types/network/global/network-global';
import { FeatureAction } from '@shared/types/store/feature-action.type';

enum NetworkGlobalActionTypes {
  NETWORK_GLOBAL_INIT = 'NETWORK_GLOBAL_INIT',
  NETWORK_GLOBAL_CLOSE = 'NETWORK_GLOBAL_CLOSE',
  NETWORK_GLOBAL_GET_GLOBAL = 'NETWORK_GLOBAL_GET_GLOBAL',
  NETWORK_GLOBAL_GET_GLOBAL_SUCCESS = 'NETWORK_GLOBAL_GET_GLOBAL_SUCCESS',
  NETWORK_GLOBAL_SELECT_GLOBAL = 'NETWORK_GLOBAL_SELECT_GLOBAL',
  NETWORK_GLOBAL_GO_LIVE = 'NETWORK_GLOBAL_GO_LIVE',
  NETWORK_GLOBAL_PAUSE = 'NETWORK_GLOBAL_PAUSE',
}

export const NETWORK_GLOBAL_INIT = NetworkGlobalActionTypes.NETWORK_GLOBAL_INIT;
export const NETWORK_GLOBAL_CLOSE = NetworkGlobalActionTypes.NETWORK_GLOBAL_CLOSE;
export const NETWORK_GLOBAL_GET_GLOBAL = NetworkGlobalActionTypes.NETWORK_GLOBAL_GET_GLOBAL;
export const NETWORK_GLOBAL_GET_GLOBAL_SUCCESS = NetworkGlobalActionTypes.NETWORK_GLOBAL_GET_GLOBAL_SUCCESS;
export const NETWORK_GLOBAL_SELECT_GLOBAL = NetworkGlobalActionTypes.NETWORK_GLOBAL_SELECT_GLOBAL;
export const NETWORK_GLOBAL_GO_LIVE = NetworkGlobalActionTypes.NETWORK_GLOBAL_GO_LIVE;
export const NETWORK_GLOBAL_PAUSE = NetworkGlobalActionTypes.NETWORK_GLOBAL_PAUSE;

export interface NetworkGlobalAction extends FeatureAction<NetworkGlobalActionTypes> {
  readonly type: NetworkGlobalActionTypes;
}

export class NetworkGlobalInit implements NetworkGlobalAction {
  readonly type = NETWORK_GLOBAL_INIT;
}

export class NetworkGlobalClose implements NetworkGlobalAction {
  readonly type = NETWORK_GLOBAL_CLOSE;
}

export class NetworkGlobalGetGlobal implements NetworkGlobalAction {
  readonly type = NETWORK_GLOBAL_GET_GLOBAL;
}

export class NetworkGlobalGetGlobalSuccess implements NetworkGlobalAction {
  readonly type = NETWORK_GLOBAL_GET_GLOBAL_SUCCESS;

  constructor(public payload: NetworkGlobal[]) {}
}

export class NetworkGlobalSelectGlobal implements NetworkGlobalAction {
  readonly type = NETWORK_GLOBAL_SELECT_GLOBAL;

  constructor(public payload: NetworkGlobal) {}
}

export class NetworkGlobalGoLive implements NetworkGlobalAction {
  readonly type = NETWORK_GLOBAL_GO_LIVE;
}

export class NetworkGlobalPause implements NetworkGlobalAction {
  readonly type = NETWORK_GLOBAL_PAUSE;
}

export type NetworkGlobalActions =
  | NetworkGlobalInit
  | NetworkGlobalClose
  | NetworkGlobalGetGlobal
  | NetworkGlobalGetGlobalSuccess
  | NetworkGlobalSelectGlobal
  | NetworkGlobalGoLive
  | NetworkGlobalPause
  ;
