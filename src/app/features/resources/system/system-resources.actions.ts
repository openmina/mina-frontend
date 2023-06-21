import { FeatureAction } from '@shared/types/store/feature-action.type';
import { SystemResourcesChartData } from '@shared/types/resources/system/system-resources-chart-data.type';
import { SystemResourcesActivePoint } from '@shared/types/resources/system/system-resources-active-point.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { SystemResourcesPointThread } from '@shared/types/resources/system/system-resources-sub-point.type';

enum SystemResourcesActionTypes {
  SYSTEM_RESOURCES_GET_RESOURCES = 'SYSTEM_RESOURCES_GET_RESOURCES',
  SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS = 'SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS',
  SYSTEM_RESOURCES_TOGGLE_SIDE_PANEL = 'SYSTEM_RESOURCES_TOGGLE_SIDE_PANEL',
  SYSTEM_RESOURCES_SET_ACTIVE_POINT = 'SYSTEM_RESOURCES_SET_ACTIVE_POINT',
  SYSTEM_RESOURCES_SET_ACTIVE_TIME = 'SYSTEM_RESOURCES_SET_ACTIVE_TIME',
  SYSTEM_RESOURCES_SORT_THREADS = 'SYSTEM_RESOURCES_SORT_THREADS',
  SYSTEM_RESOURCES_SET_SIDE_PANEL_ACTIVE_PATH = 'SYSTEM_RESOURCES_SET_SIDE_PANEL_ACTIVE_PATH',
  SYSTEM_RESOURCES_REDRAW_CHARTS = 'SYSTEM_RESOURCES_REDRAW_CHARTS',
  SYSTEM_RESOURCES_CLOSE = 'SYSTEM_RESOURCES_CLOSE',
}

export const SYSTEM_RESOURCES_GET_RESOURCES = SystemResourcesActionTypes.SYSTEM_RESOURCES_GET_RESOURCES;
export const SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS = SystemResourcesActionTypes.SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS;
export const SYSTEM_RESOURCES_TOGGLE_SIDE_PANEL = SystemResourcesActionTypes.SYSTEM_RESOURCES_TOGGLE_SIDE_PANEL;
export const SYSTEM_RESOURCES_SET_ACTIVE_POINT = SystemResourcesActionTypes.SYSTEM_RESOURCES_SET_ACTIVE_POINT;
export const SYSTEM_RESOURCES_SET_ACTIVE_TIME = SystemResourcesActionTypes.SYSTEM_RESOURCES_SET_ACTIVE_TIME;
export const SYSTEM_RESOURCES_SORT_THREADS = SystemResourcesActionTypes.SYSTEM_RESOURCES_SORT_THREADS;
export const SYSTEM_RESOURCES_SET_SIDE_PANEL_ACTIVE_PATH = SystemResourcesActionTypes.SYSTEM_RESOURCES_SET_SIDE_PANEL_ACTIVE_PATH;
export const SYSTEM_RESOURCES_REDRAW_CHARTS = SystemResourcesActionTypes.SYSTEM_RESOURCES_REDRAW_CHARTS;
export const SYSTEM_RESOURCES_CLOSE = SystemResourcesActionTypes.SYSTEM_RESOURCES_CLOSE;

export interface SystemResourcesAction extends FeatureAction<SystemResourcesActionTypes> {
  readonly type: SystemResourcesActionTypes;
}

export class SystemResourcesGetResources implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_GET_RESOURCES;
}

export class SystemResourcesGetResourcesSuccess implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS;

  constructor(public payload: SystemResourcesChartData) {}
}

export class SystemResourcesToggleSidePanel implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_TOGGLE_SIDE_PANEL;
}

export class SystemResourcesSetActivePoint implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_SET_ACTIVE_POINT;

  constructor(public payload: SystemResourcesActivePoint) {}
}

export class SystemResourcesSetActiveTime implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_SET_ACTIVE_TIME;

  constructor(public payload: { timestamp: number, resource: string }) {}
}

export class SystemResourcesSortThreads implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_SORT_THREADS;

  constructor(public payload: TableSort<SystemResourcesPointThread>) {}
}

export class SystemResourcesSetSidePanelActivePath implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_SET_SIDE_PANEL_ACTIVE_PATH;

  constructor(public payload: string) {}
}

export class SystemResourcesRedrawCharts implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_REDRAW_CHARTS;
}

export class SystemResourcesClose implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_CLOSE;
}

export type SystemResourcesActions =
  | SystemResourcesGetResources
  | SystemResourcesGetResourcesSuccess
  | SystemResourcesToggleSidePanel
  | SystemResourcesSetActivePoint
  | SystemResourcesSetActiveTime
  | SystemResourcesSortThreads
  | SystemResourcesSetSidePanelActivePath
  | SystemResourcesRedrawCharts
  | SystemResourcesClose
  ;
