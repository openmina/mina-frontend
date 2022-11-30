import { NetworkGlobal } from '@shared/types/network/global/network-global';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkGlobalState } from '@network/network.state';
import { NetworkTransaction } from '@shared/types/network/transactions/network-transaction';

export interface NetworkGlobalState {
  globalMessages: NetworkGlobal[];
  activeGlobalMessage: NetworkGlobal;
  stream: boolean;
}

const select = <T>(selector: (state: NetworkGlobalState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectNetworkGlobalState,
  selector,
);

export const selectNetworkGlobalMessages = select((state: NetworkGlobalState): NetworkTransaction[] => state.globalMessages);
export const selectNetworkGlobalActiveGlobal = select((state: NetworkGlobalState): NetworkTransaction => state.activeGlobalMessage);
