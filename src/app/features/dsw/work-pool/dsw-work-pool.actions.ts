import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { WorkPoolSpecs } from '@shared/types/dsw/work-pool/work-pool-specs.type';

enum DswWorkPoolTypes {
  DSW_WORK_POOL_INIT = 'DSW_WORK_POOL_INIT',
  DSW_WORK_POOL_GET_WORK_POOL = 'DSW_WORK_POOL_GET_WORK_POOL',
  DSW_WORK_POOL_GET_WORK_POOL_SUCCESS = 'DSW_WORK_POOL_GET_WORK_POOL_SUCCESS',
  DSW_WORK_POOL_SORT_WORK_POOL = 'DSW_WORK_POOL_SORT_WORK_POOL',
  DSW_WORK_POOL_SET_ACTIVE_WORK_POOL = 'DSW_WORK_POOL_SET_ACTIVE_WORK_POOL',
  DSW_WORK_POOL_GET_WORK_POOL_SPECS_SUCCESS = 'DSW_WORK_POOL_GET_WORK_POOL_SPECS_SUCCESS',
  DSW_WORK_POOL_TOGGLE_SIDE_PANEL = 'DSW_WORK_POOL_TOGGLE_SIDE_PANEL',
  DSW_WORK_POOL_TOGGLE_FILTER = 'DSW_WORK_POOL_TOGGLE_FILTER',
  DSW_WORK_POOL_CLOSE = 'DSW_WORK_POOL_CLOSE',
}

export const DSW_WORK_POOL_INIT = DswWorkPoolTypes.DSW_WORK_POOL_INIT;
export const DSW_WORK_POOL_GET_WORK_POOL = DswWorkPoolTypes.DSW_WORK_POOL_GET_WORK_POOL;
export const DSW_WORK_POOL_GET_WORK_POOL_SUCCESS = DswWorkPoolTypes.DSW_WORK_POOL_GET_WORK_POOL_SUCCESS;
export const DSW_WORK_POOL_SORT_WORK_POOL = DswWorkPoolTypes.DSW_WORK_POOL_SORT_WORK_POOL;
export const DSW_WORK_POOL_SET_ACTIVE_WORK_POOL = DswWorkPoolTypes.DSW_WORK_POOL_SET_ACTIVE_WORK_POOL;
export const DSW_WORK_POOL_GET_WORK_POOL_SPECS_SUCCESS = DswWorkPoolTypes.DSW_WORK_POOL_GET_WORK_POOL_SPECS_SUCCESS;
export const DSW_WORK_POOL_TOGGLE_SIDE_PANEL = DswWorkPoolTypes.DSW_WORK_POOL_TOGGLE_SIDE_PANEL;
export const DSW_WORK_POOL_TOGGLE_FILTER = DswWorkPoolTypes.DSW_WORK_POOL_TOGGLE_FILTER;
export const DSW_WORK_POOL_CLOSE = DswWorkPoolTypes.DSW_WORK_POOL_CLOSE;

export interface DswWorkPoolAction extends FeatureAction<DswWorkPoolTypes> {
  readonly type: DswWorkPoolTypes;
}

export class DswWorkPoolInit implements DswWorkPoolAction {
  readonly type = DSW_WORK_POOL_INIT;
}

export class DswWorkPoolGetWorkPool implements DswWorkPoolAction {
  readonly type = DSW_WORK_POOL_GET_WORK_POOL;

  constructor(public payload?: { force?: boolean }) { }
}

export class DswWorkPoolGetWorkPoolSuccess implements DswWorkPoolAction {
  readonly type = DSW_WORK_POOL_GET_WORK_POOL_SUCCESS;

  constructor(public payload: WorkPool[]) { }
}

export class DswWorkPoolSortWorkPool implements DswWorkPoolAction {
  readonly type = DSW_WORK_POOL_SORT_WORK_POOL;

  constructor(public payload: TableSort<WorkPool>) { }
}

export class DswWorkPoolSetActiveWorkPool implements DswWorkPoolAction {
  readonly type = DSW_WORK_POOL_SET_ACTIVE_WORK_POOL;

  constructor(public payload: { id: string }) { }
}

export class DswWorkPoolGetWorkPoolSpecsSuccess implements DswWorkPoolAction {
  readonly type = DSW_WORK_POOL_GET_WORK_POOL_SPECS_SUCCESS;

  constructor(public payload: WorkPoolSpecs) { }
}

export class DswWorkPoolToggleSidePanel implements DswWorkPoolAction {
  readonly type = DSW_WORK_POOL_TOGGLE_SIDE_PANEL;
}

export class DswWorkPoolToggleFilter implements DswWorkPoolAction {
  readonly type = DSW_WORK_POOL_TOGGLE_FILTER;

  constructor(public payload: string) { }
}

export class DswWorkPoolClose implements DswWorkPoolAction {
  readonly type = DSW_WORK_POOL_CLOSE;
}

export type DswWorkPoolActions =
  | DswWorkPoolInit
  | DswWorkPoolGetWorkPool
  | DswWorkPoolGetWorkPoolSuccess
  | DswWorkPoolSortWorkPool
  | DswWorkPoolSetActiveWorkPool
  | DswWorkPoolGetWorkPoolSpecsSuccess
  | DswWorkPoolToggleSidePanel
  | DswWorkPoolToggleFilter
  | DswWorkPoolClose
  ;
