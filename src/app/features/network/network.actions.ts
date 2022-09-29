import { FeatureAction } from '@shared/types/store/feature-action.type';
import { NetworkMessage } from '@shared/types/network/network-message.type';
import { NetworkConnection } from '@shared/types/network/network-connection.type';
import { NetworkFilter } from '@shared/types/network/network-filter.type';
import { NetworkMessagesDirection } from '@shared/types/network/network-messages-direction.enum';

enum NetworkActionTypes {
  NETWORK_INIT = 'NETWORK_INIT',
  NETWORK_GET_MESSAGES = 'NETWORK_GET_MESSAGES',
  NETWORK_GET_MESSAGES_SUCCESS = 'NETWORK_GET_MESSAGES_SUCCESS',
  NETWORK_GET_PAGINATED_MESSAGES = 'NETWORK_GET_PAGINATED_MESSAGES',
  NETWORK_CLOSE = 'NETWORK_CLOSE',
  NETWORK_TOGGLE_FILTER = 'NETWORK_TOGGLE_FILTER',
  NETWORK_SET_TIMESTAMP_INTERVAL = 'NETWORK_SET_TIMESTAMP_INTERVAL',
  NETWORK_SET_ACTIVE_ROW = 'NETWORK_SET_ACTIVE_ROW',
  NETWORK_GO_LIVE = 'NETWORK_GO_LIVE',
  NETWORK_PAUSE = 'NETWORK_PAUSE',
  NETWORK_GET_FULL_MESSAGE = 'NETWORK_GET_FULL_MESSAGE',
  NETWORK_GET_FULL_MESSAGE_SUCCESS = 'NETWORK_GET_FULL_MESSAGE_SUCCESS',
  NETWORK_GET_MESSAGE_HEX = 'NETWORK_GET_MESSAGE_HEX',
  NETWORK_GET_MESSAGE_HEX_SUCCESS = 'NETWORK_GET_MESSAGE_HEX_SUCCESS',
  NETWORK_GET_CONNECTION = 'NETWORK_GET_CONNECTION',
  NETWORK_GET_CONNECTION_SUCCESS = 'NETWORK_GET_CONNECTION_SUCCESS',
  NETWORK_CHANGE_TAB = 'NETWORK_CHANGE_TAB',
  NETWORK_GET_SPECIFIC_MESSAGE = 'NETWORK_GET_SPECIFIC_MESSAGE',
}

export const NETWORK_INIT = NetworkActionTypes.NETWORK_INIT;
export const NETWORK_GET_MESSAGES = NetworkActionTypes.NETWORK_GET_MESSAGES;
export const NETWORK_GET_MESSAGES_SUCCESS = NetworkActionTypes.NETWORK_GET_MESSAGES_SUCCESS;
export const NETWORK_GET_PAGINATED_MESSAGES = NetworkActionTypes.NETWORK_GET_PAGINATED_MESSAGES;
export const NETWORK_CLOSE = NetworkActionTypes.NETWORK_CLOSE;
export const NETWORK_TOGGLE_FILTER = NetworkActionTypes.NETWORK_TOGGLE_FILTER;
export const NETWORK_SET_TIMESTAMP_INTERVAL = NetworkActionTypes.NETWORK_SET_TIMESTAMP_INTERVAL;
export const NETWORK_SET_ACTIVE_ROW = NetworkActionTypes.NETWORK_SET_ACTIVE_ROW;
export const NETWORK_GO_LIVE = NetworkActionTypes.NETWORK_GO_LIVE;
export const NETWORK_PAUSE = NetworkActionTypes.NETWORK_PAUSE;
export const NETWORK_GET_FULL_MESSAGE = NetworkActionTypes.NETWORK_GET_FULL_MESSAGE;
export const NETWORK_GET_FULL_MESSAGE_SUCCESS = NetworkActionTypes.NETWORK_GET_FULL_MESSAGE_SUCCESS;
export const NETWORK_GET_MESSAGE_HEX = NetworkActionTypes.NETWORK_GET_MESSAGE_HEX;
export const NETWORK_GET_MESSAGE_HEX_SUCCESS = NetworkActionTypes.NETWORK_GET_MESSAGE_HEX_SUCCESS;
export const NETWORK_GET_CONNECTION = NetworkActionTypes.NETWORK_GET_CONNECTION;
export const NETWORK_GET_CONNECTION_SUCCESS = NetworkActionTypes.NETWORK_GET_CONNECTION_SUCCESS;
export const NETWORK_CHANGE_TAB = NetworkActionTypes.NETWORK_CHANGE_TAB;
export const NETWORK_GET_SPECIFIC_MESSAGE = NetworkActionTypes.NETWORK_GET_SPECIFIC_MESSAGE;

export interface NetworkAction extends FeatureAction<NetworkActionTypes> {
  readonly type: NetworkActionTypes;
}

export class NetworkInit implements NetworkAction {
  readonly type = NETWORK_INIT;
}

export class NetworkClose implements NetworkAction {
  readonly type = NETWORK_CLOSE;
}

export class NetworkGetMessages implements NetworkAction {
  readonly type = NETWORK_GET_MESSAGES;
}

export class NetworkGetPaginatedMessages implements NetworkAction {
  readonly type = NETWORK_GET_PAGINATED_MESSAGES;

  constructor(public payload: { id?: number, direction?: NetworkMessagesDirection }) {}
}

export class NetworkGetMessagesSuccess implements NetworkAction {
  readonly type = NETWORK_GET_MESSAGES_SUCCESS;

  constructor(public payload: NetworkMessage[]) {}
}

export class NetworkToggleFilter implements NetworkAction {
  readonly type = NETWORK_TOGGLE_FILTER;

  constructor(public payload: { filters: NetworkFilter[], type: 'add' | 'remove' }) {}
}

export class NetworkSetTimestampInterval implements NetworkAction {
  readonly type = NETWORK_SET_TIMESTAMP_INTERVAL;

  constructor(public payload: { from: number, to: number, direction?: NetworkMessagesDirection }) {}
}

export class NetworkSetActiveRow implements NetworkAction {
  readonly type = NETWORK_SET_ACTIVE_ROW;

  constructor(public payload: NetworkMessage) {}
}

export class NetworkGoLive implements NetworkAction {
  readonly type = NETWORK_GO_LIVE;
}

export class NetworkPause implements NetworkAction {
  readonly type = NETWORK_PAUSE;
}

export class NetworkGetFullMessage implements NetworkAction {
  readonly type = NETWORK_GET_FULL_MESSAGE;

  constructor(public payload: { id: number }) {}
}

export class NetworkGetFullMessageSuccess implements NetworkAction {
  readonly type = NETWORK_GET_FULL_MESSAGE_SUCCESS;

  constructor(public payload: any) {}
}

export class NetworkGetConnection implements NetworkAction {
  readonly type = NETWORK_GET_CONNECTION;

  constructor(public payload: { id: number }) {}
}

export class NetworkGetConnectionSuccess implements NetworkAction {
  readonly type = NETWORK_GET_CONNECTION_SUCCESS;

  constructor(public payload: NetworkConnection) {}
}

export class NetworkGetMessageHex implements NetworkAction {
  readonly type = NETWORK_GET_MESSAGE_HEX;

  constructor(public payload: { id: number }) {}
}

export class NetworkGetMessageHexSuccess implements NetworkAction {
  readonly type = NETWORK_GET_MESSAGE_HEX_SUCCESS;

  constructor(public payload: string) {}
}

export class NetworkChangeTab implements NetworkAction {
  readonly type = NETWORK_CHANGE_TAB;

  constructor(public payload: number) {}
}

export class NetworkGetSpecificMessage implements NetworkAction {
  readonly type = NETWORK_GET_SPECIFIC_MESSAGE;

  constructor(public payload: { id: number, filters: NetworkFilter[], type: 'add' | 'remove' }) {}
}

export type NetworkActions =
  | NetworkInit
  | NetworkClose
  | NetworkGetMessages
  | NetworkGetMessagesSuccess
  | NetworkGetPaginatedMessages
  | NetworkToggleFilter
  | NetworkSetTimestampInterval
  | NetworkSetActiveRow
  | NetworkGoLive
  | NetworkPause
  | NetworkGetFullMessage
  | NetworkGetFullMessageSuccess
  | NetworkGetMessageHex
  | NetworkGetMessageHexSuccess
  | NetworkGetConnection
  | NetworkGetConnectionSuccess
  | NetworkChangeTab
  | NetworkGetSpecificMessage
  ;
