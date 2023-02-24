import { FeatureAction } from '@shared/types/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { SnarkWorkerTraceFilter } from '@shared/types/explorer/snark-traces/snark-worker-trace-filters.type';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';

enum SWTracesActionTypes {
  SW_TRACES_GET_JOBS = 'SW_TRACES_GET_JOBS',
  SW_TRACES_GET_JOBS_SUCCESS = 'SW_TRACES_GET_JOBS_SUCCESS',
  SW_TRACES_SORT = 'SW_TRACES_SORT',
  SW_TRACES_SET_ACTIVE_JOB = 'SW_TRACES_SET_ACTIVE_JOB',
  SW_TRACES_CLOSE = 'NETWORK_TRANSACTIONS_CLOSE',
}

export const SW_TRACES_GET_JOBS = SWTracesActionTypes.SW_TRACES_GET_JOBS;
export const SW_TRACES_GET_JOBS_SUCCESS = SWTracesActionTypes.SW_TRACES_GET_JOBS_SUCCESS;
export const SW_TRACES_SORT = SWTracesActionTypes.SW_TRACES_SORT;
export const SW_TRACES_SET_ACTIVE_JOB = SWTracesActionTypes.SW_TRACES_SET_ACTIVE_JOB;
export const SW_TRACES_CLOSE = SWTracesActionTypes.SW_TRACES_CLOSE;

export interface SWTracesAction extends FeatureAction<SWTracesActionTypes> {
  readonly type: SWTracesActionTypes;
}

export class SWTracesGetJobs implements SWTracesAction {
  readonly type = SW_TRACES_GET_JOBS;

  constructor(public payload: SnarkWorkerTraceFilter) {}
}

export class SWTracesGetJobsSuccess implements SWTracesAction {
  readonly type = SW_TRACES_GET_JOBS_SUCCESS;

  constructor(public payload: SnarkWorkerTraceJob[]) {}
}

export class SWTracesSort implements SWTracesAction {
  readonly type = SW_TRACES_SORT;

  constructor(public payload: TableSort<SnarkWorkerTraceJob>) {}
}

export class SWTracesSetActiveJob implements SWTracesAction {
  readonly type = SW_TRACES_SET_ACTIVE_JOB;

  constructor(public payload: SnarkWorkerTraceJob) {}
}

export class SWTracesClose implements SWTracesAction {
  readonly type = SW_TRACES_CLOSE;
}


export type SWTracesActions =
  | SWTracesGetJobs
  | SWTracesGetJobsSuccess
  | SWTracesSort
  | SWTracesSetActiveJob
  | SWTracesClose
  ;
