import { MinaState } from '@app/app.setup';
import { AppNodeStatus } from '@shared/types/app/app-node-status.type';
import { AppMenu } from '@shared/types/app/app-menu.type';

export interface AppState {
  lastBlockLevel: number;
  status: AppNodeStatus;
  timestamp: number;
  menu: AppMenu;
  subMenus: string[];
}

export const selectAppLastBlockLevelAndStatus = (state: MinaState): { level: number, status: AppNodeStatus, timestamp: number } => ({
  level: state.app.lastBlockLevel,
  status: state.app.status,
  timestamp: state.app.timestamp,
});
export const selectAppMenu = (state: MinaState): AppMenu => state.app.menu;
export const selectAppSubMenus = (state: MinaState): string[] => state.app.subMenus;
