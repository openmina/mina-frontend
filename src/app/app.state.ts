import { MinaState } from '@app/app.setup';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { DebuggerStatus } from '@shared/types/app/debugger-status.type';

export interface AppState {
  nodeStatus: NodeStatus;
  debuggerStatus: DebuggerStatus;
  subMenus: string[];
  menu: AppMenu;
}

const select = <T>(selector: (state: AppState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectAppState,
  selector,
);

export const selectAppState = (state: MinaState): AppState => state.app;
export const selectAppMenu = select((state: AppState): AppMenu => state.menu);
export const selectAppNodeStatus = select((state: AppState): NodeStatus => state.nodeStatus);
export const selectAppDebuggerStatus = select((state: AppState): DebuggerStatus => state.debuggerStatus);
export const selectAppSubMenus = select((state: AppState): string[] => state.subMenus);
