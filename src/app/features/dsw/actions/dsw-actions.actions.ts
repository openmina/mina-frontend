import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { DswActionGroup } from '@shared/types/dsw/actions/dsw-action-group.type';
import { DswActionsStats } from '@shared/types/dsw/actions/dsw-actions-stats.type';

enum DswActionsActionTypes {
  DSW_ACTIONS_GET_EARLIEST_SLOT = 'DSW_ACTIONS_GET_EARLIEST_SLOT',
  DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS = 'DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS',
  DSW_ACTIONS_GET_ACTIONS = 'DSW_ACTIONS_GET_ACTIONS',
  DSW_ACTIONS_GET_ACTIONS_SUCCESS = 'DSW_ACTIONS_GET_ACTIONS_SUCCESS',
  DSW_ACTIONS_CLOSE = 'DSW_ACTIONS_CLOSE',
  DSW_ACTIONS_TOGGLE_SIDE_PANEL = 'DSW_ACTIONS_TOGGLE_SIDE_PANEL',
  DSW_ACTIONS_SORT = 'DSW_ACTIONS_SORT',
  DSW_ACTIONS_SEARCH = 'DSW_ACTIONS_SEARCH',
}

export const DSW_ACTIONS_GET_EARLIEST_SLOT = DswActionsActionTypes.DSW_ACTIONS_GET_EARLIEST_SLOT;
export const DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS = DswActionsActionTypes.DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS;
export const DSW_ACTIONS_GET_ACTIONS = DswActionsActionTypes.DSW_ACTIONS_GET_ACTIONS;
export const DSW_ACTIONS_GET_ACTIONS_SUCCESS = DswActionsActionTypes.DSW_ACTIONS_GET_ACTIONS_SUCCESS;
export const DSW_ACTIONS_CLOSE = DswActionsActionTypes.DSW_ACTIONS_CLOSE;
export const DSW_ACTIONS_TOGGLE_SIDE_PANEL = DswActionsActionTypes.DSW_ACTIONS_TOGGLE_SIDE_PANEL;
export const DSW_ACTIONS_SORT = DswActionsActionTypes.DSW_ACTIONS_SORT;
export const DSW_ACTIONS_SEARCH = DswActionsActionTypes.DSW_ACTIONS_SEARCH;

export interface DswActionsAction extends FeatureAction<DswActionsActionTypes> {
  readonly type: DswActionsActionTypes;
}

export class DswActionsGetEarliestSlot implements DswActionsAction {
  readonly type = DSW_ACTIONS_GET_EARLIEST_SLOT;
}

export class DswActionsGetEarliestSlotSuccess implements DswActionsAction {
  readonly type = DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS;

  constructor(public payload: number) { }
}

export class DswActionsGetActions implements DswActionsAction {
  readonly type = DSW_ACTIONS_GET_ACTIONS;

  constructor(public payload: { slot: number }) { }
}

export class DswActionsGetActionsSuccess implements DswActionsAction {
  readonly type = DSW_ACTIONS_GET_ACTIONS_SUCCESS;

  constructor(public payload: [DswActionsStats, DswActionGroup[]]) { }
}

export class DswActionsClose implements DswActionsAction {
  readonly type = DSW_ACTIONS_CLOSE;
}

export class DswActionsToggleSidePanel implements DswActionsAction {
  readonly type = DSW_ACTIONS_TOGGLE_SIDE_PANEL;
}

export class DswActionsSort implements DswActionsAction {
  readonly type = DSW_ACTIONS_SORT;

  constructor(public payload: TableSort<DswActionGroup>) { }
}

export class DswActionsSearch implements DswActionsAction {
  readonly type = DSW_ACTIONS_SEARCH;

  constructor(public payload: string) { }
}

export type DswActionsActions =
  | DswActionsGetEarliestSlot
  | DswActionsGetEarliestSlotSuccess
  | DswActionsGetActions
  | DswActionsGetActionsSuccess
  | DswActionsClose
  | DswActionsToggleSidePanel
  | DswActionsSort
  | DswActionsSearch
  ;
