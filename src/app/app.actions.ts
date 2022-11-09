import { FeatureAction } from '@shared/types/store/feature-action.type';
import { NodeStatus } from '@shared/types/app/node-status.type';

enum AppActionTypes {
  APP_INIT = 'APP_INIT',
  APP_GET_NODE_STATUS = 'APP_GET_NODE_STATUS',
  APP_GET_NODE_STATUS_SUCCESS = 'APP_GET_NODE_STATUS_SUCCESS',
  APP_GET_DEBUGGER_STATUS = 'APP_GET_DEBUGGER_STATUS',
  APP_UPDATE_DEBUGGER_STATUS = 'APP_UPDATE_DEBUGGER_STATUS',
  APP_CHANGE_MENU_COLLAPSING = 'APP_CHANGE_MENU_COLLAPSING',
  APP_CHANGE_SUB_MENUS = 'APP_CHANGE_SUB_MENUS',
}

export const APP_INIT = AppActionTypes.APP_INIT;
export const APP_GET_NODE_STATUS = AppActionTypes.APP_GET_NODE_STATUS;
export const APP_GET_NODE_STATUS_SUCCESS = AppActionTypes.APP_GET_NODE_STATUS_SUCCESS;
export const APP_GET_DEBUGGER_STATUS = AppActionTypes.APP_GET_DEBUGGER_STATUS;
export const APP_UPDATE_DEBUGGER_STATUS = AppActionTypes.APP_UPDATE_DEBUGGER_STATUS;
export const APP_CHANGE_MENU_COLLAPSING = AppActionTypes.APP_CHANGE_MENU_COLLAPSING;
export const APP_CHANGE_SUB_MENUS = AppActionTypes.APP_CHANGE_SUB_MENUS;

export interface AppAction extends FeatureAction<AppActionTypes> {
  readonly type: AppActionTypes;
}

export class AppInit implements AppAction {
  readonly type = APP_INIT;
}

export class AppGetNodeStatus implements AppAction {
  readonly type = APP_GET_NODE_STATUS;
}

export class AppGetNodeStatusSuccess implements AppAction {
  readonly type = APP_GET_NODE_STATUS_SUCCESS;

  constructor(public payload: NodeStatus) { }
}

export class AppGetDebuggerStatus implements AppAction {
  readonly type = APP_GET_DEBUGGER_STATUS;
}

export class AppUpdateDebuggerStatus implements AppAction {
  readonly type = APP_UPDATE_DEBUGGER_STATUS;

  constructor(public payload: { isOnline?: boolean, failed?: number }) { }
}

export class AppChangeMenuCollapsing implements AppAction {
  readonly type = APP_CHANGE_MENU_COLLAPSING;

  constructor(public payload: boolean) { }
}

export class AppChangeSubMenus implements AppAction {
  readonly type = APP_CHANGE_SUB_MENUS;

  constructor(public payload: string[]) { }
}

export type AppActions =
  | AppInit
  | AppGetNodeStatus
  | AppGetNodeStatusSuccess
  | AppGetDebuggerStatus
  | AppUpdateDebuggerStatus
  | AppChangeMenuCollapsing
  | AppChangeSubMenus
  ;
