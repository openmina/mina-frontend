import { FeatureAction } from '@shared/types/store/feature-action.type';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { Routes } from '@shared/enums/routes.enum';

enum AppActionTypes {
  APP_INIT = 'APP_INIT',
  APP_INIT_SUCCESS = 'APP_INIT_SUCCESS',
  APP_CHANGE_ACTIVE_NODE = 'APP_CHANGE_ACTIVE_NODE',
  APP_ADD_NODE = 'APP_ADD_NODE',
  APP_START_BACKGROUND_CHECKS = 'APP_START_BACKGROUND_CHECKS',
  APP_GET_NODE_STATUS = 'APP_GET_NODE_STATUS',
  APP_GET_NODE_STATUS_SUCCESS = 'APP_GET_NODE_STATUS_SUCCESS',
  APP_GET_DEBUGGER_STATUS = 'APP_GET_DEBUGGER_STATUS',
  APP_UPDATE_DEBUGGER_STATUS = 'APP_UPDATE_DEBUGGER_STATUS',
  APP_CHANGE_MENU_COLLAPSING = 'APP_CHANGE_MENU_COLLAPSING',
  APP_CHANGE_SUB_MENUS = 'APP_CHANGE_SUB_MENUS',
  APP_TOGGLE_MOBILE = 'APP_TOGGLE_MOBILE',
  APP_TOGGLE_MENU_OPENING = 'APP_TOGGLE_MENU_OPENING',
}

export const APP_INIT = AppActionTypes.APP_INIT;
export const APP_INIT_SUCCESS = AppActionTypes.APP_INIT_SUCCESS;
export const APP_CHANGE_ACTIVE_NODE = AppActionTypes.APP_CHANGE_ACTIVE_NODE;
export const APP_ADD_NODE = AppActionTypes.APP_ADD_NODE;
export const APP_START_BACKGROUND_CHECKS = AppActionTypes.APP_START_BACKGROUND_CHECKS;
export const APP_GET_NODE_STATUS = AppActionTypes.APP_GET_NODE_STATUS;
export const APP_GET_NODE_STATUS_SUCCESS = AppActionTypes.APP_GET_NODE_STATUS_SUCCESS;
export const APP_GET_DEBUGGER_STATUS = AppActionTypes.APP_GET_DEBUGGER_STATUS;
export const APP_UPDATE_DEBUGGER_STATUS = AppActionTypes.APP_UPDATE_DEBUGGER_STATUS;
export const APP_CHANGE_MENU_COLLAPSING = AppActionTypes.APP_CHANGE_MENU_COLLAPSING;
export const APP_CHANGE_SUB_MENUS = AppActionTypes.APP_CHANGE_SUB_MENUS;
export const APP_TOGGLE_MOBILE = AppActionTypes.APP_TOGGLE_MOBILE;
export const APP_TOGGLE_MENU_OPENING = AppActionTypes.APP_TOGGLE_MENU_OPENING;

export interface AppAction extends FeatureAction<AppActionTypes> {
  readonly type: AppActionTypes;
}

export class AppInit implements AppAction {
  readonly type = APP_INIT;
}

export class AppInitSuccess implements AppAction {
  readonly type = APP_INIT_SUCCESS;

  constructor(public payload: { node: MinaNode }) {}
}

export class AppStartBackgroundChecks implements AppAction {
  readonly type = APP_START_BACKGROUND_CHECKS;
}

export class AppChangeActiveNode implements AppAction {
  readonly type = APP_CHANGE_ACTIVE_NODE;

  constructor(public payload: MinaNode) { }
}

export class AppAddNode implements AppAction {
  readonly type = APP_ADD_NODE;

  constructor(public payload: string) { }
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

  constructor(public payload: Routes[]) {}
}

export class AppToggleMobile implements AppAction {
  readonly type = APP_TOGGLE_MOBILE;

  constructor(public payload: { isMobile: boolean }) { }
}

export class AppToggleMenuOpening implements AppAction {
  readonly type = APP_TOGGLE_MENU_OPENING;
}

export type AppActions =
  | AppInit
  | AppInitSuccess
  | AppStartBackgroundChecks
  | AppChangeActiveNode
  | AppGetNodeStatus
  | AppGetNodeStatusSuccess
  | AppGetDebuggerStatus
  | AppUpdateDebuggerStatus
  | AppChangeMenuCollapsing
  | AppChangeSubMenus
  | AppToggleMobile
  | AppToggleMenuOpening
  ;
