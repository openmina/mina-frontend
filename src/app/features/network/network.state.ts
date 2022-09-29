import { MinaState } from '@app/app.setup';
import { NetworkMessage } from '@shared/types/network/network-message.type';
import { NetworkConnection } from '@shared/types/network/network-connection.type';
import { VirtualScrollActivePage } from '@shared/types/shared/virtual-scroll-active-page.type';
import { NetworkFilter } from '@shared/types/network/network-filter.type';
import { NetworkMessagesDirection } from '@shared/types/network/network-messages-direction.enum';
import { NetworkTimestampInterval } from '@shared/types/network/network-timestamp-interval.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';

export interface NetworkState {
  messages: NetworkMessage[];
  activeRow: NetworkMessage;
  activeRowFullMessage: any;
  activeRowHex: string;
  connection: NetworkConnection;
  activeFilters: NetworkFilter[];
  timestamp: NetworkTimestampInterval;
  activeTab: number;
  stream: boolean;
  limit: number;
  direction: NetworkMessagesDirection;
  activePage: VirtualScrollActivePage<NetworkMessage>;
  pages: number[];
}

const select = <T>(selector: (state: NetworkState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectNetworkState,
  selector,
);

export const selectNetworkState = (state: MinaState): NetworkState => state.network;
export const selectNetworkStream = select((network: NetworkState): boolean => network.stream);
export const selectNetworkMessages = select((network: NetworkState): NetworkMessage[] => network.messages);
export const selectNetworkActiveRow = select((network: NetworkState): NetworkMessage => network.activeRow);
export const selectNetworkMessageHex = select((network: NetworkState): string => network.activeRowHex);
export const selectNetworkFullMessage = select((network: NetworkState): any => network.activeRowFullMessage);
export const selectNetworkConnection = select((network: NetworkState): NetworkConnection => network.connection);
export const selectNetworkActiveFilters = select((network: NetworkState): NetworkFilter[] => network.activeFilters);
export const selectNetworkTimestampInterval = select((network: NetworkState): NetworkTimestampInterval => network.timestamp);
