import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { SortDirection } from '@shared/types/shared/table-sort.type';

enum TracingOverviewActionTypes {
  TRACING_OVERVIEW_GET_CHECKPOINTS = 'TRACING_OVERVIEW_GET_CHECKPOINTS',
  TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS = 'TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS',
  TRACING_OVERVIEW_SORT = 'TRACING_OVERVIEW_SORT',
  TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW = 'TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW',
  TRACING_OVERVIEW_CLOSE = 'TRACING_OVERVIEW_CLOSE',
}

export const TRACING_OVERVIEW_GET_CHECKPOINTS = TracingOverviewActionTypes.TRACING_OVERVIEW_GET_CHECKPOINTS;
export const TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS = TracingOverviewActionTypes.TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS;
export const TRACING_OVERVIEW_SORT = TracingOverviewActionTypes.TRACING_OVERVIEW_SORT;
export const TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW = TracingOverviewActionTypes.TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW;
export const TRACING_OVERVIEW_CLOSE = TracingOverviewActionTypes.TRACING_OVERVIEW_CLOSE;

export interface TracingOverviewAction extends FeatureAction<TracingOverviewActionTypes> {
  readonly type: TracingOverviewActionTypes;
}

export class TracingOverviewGetCheckpoints implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_GET_CHECKPOINTS;
}

export class TracingOverviewGetCheckpointsSuccess implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS;

  constructor(public payload: TracingOverviewCheckpoint[]) {}
}

export class TracingOverviewSort implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_SORT;

  constructor(public payload: SortDirection) {}
}

export class TracingOverviewToggleCondensedView implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW;
}

export class TracingOverviewClose implements TracingOverviewAction {
  readonly type = TRACING_OVERVIEW_CLOSE;
}


export type TracingOverviewActions =
  | TracingOverviewGetCheckpoints
  | TracingOverviewGetCheckpointsSuccess
  | TracingOverviewSort
  | TracingOverviewToggleCondensedView
  | TracingOverviewClose
  ;
