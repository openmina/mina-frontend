import { MinaState } from '@app/app.setup';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { DebuggerStatus } from '@shared/types/app/debugger-status.type';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';

export interface AppState {
  nodeStatus: NodeStatus;
  debuggerStatus: DebuggerStatus;
  subMenus: string[];
  menu: AppMenu;
  nodes: MinaNode[];
  activeNode: MinaNode;
}

const select = <T>(selector: (state: AppState) => T): MinaSelector<T> => createSelector(
  selectAppState,
  selector,
);

type MinaSelector<T> = MemoizedSelector<MinaState, T>;

export const selectAppState = (state: MinaState): AppState => state.app;
export const selectAppMenu = select((state: AppState): AppMenu => state.menu);
export const selectAppNodeStatus = select((state: AppState): NodeStatus => state.nodeStatus);
export const selectAppDebuggerStatus = select((state: AppState): DebuggerStatus => state.debuggerStatus);
export const selectNodes: MinaSelector<MinaNode[]> = select(state => state.nodes);
export const selectActiveNode: MinaSelector<MinaNode> = select(state => state.activeNode);
