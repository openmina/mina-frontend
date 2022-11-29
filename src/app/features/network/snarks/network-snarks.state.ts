import { NetworkSnark } from '@shared/types/network/snarks/network-snark';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkSnarksState } from '@network/network.state';

export interface NetworkSnarksState {
  snarks: NetworkSnark[];
  activeSnark: NetworkSnark;
  stream: boolean;
}

const select = <T>(selector: (state: NetworkSnarksState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectNetworkSnarksState,
  selector,
);

export const selectNetworkSnarks = select((state: NetworkSnarksState): NetworkSnark[] => state.snarks);
export const selectNetworkSnarksActiveSnark = select((state: NetworkSnarksState): NetworkSnark => state.activeSnark);
