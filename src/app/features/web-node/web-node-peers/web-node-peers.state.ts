import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectWebNodePeersState } from '@web-node/web-node.state';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';

export interface WebNodePeersState {
  activePeer: WebNodeLog;
}

const select = <T>(selector: (state: WebNodePeersState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectWebNodePeersState,
  selector,
);

export const selectWebNodePeersActivePeer = select((webNode: WebNodePeersState): WebNodeLog => webNode.activePeer);
