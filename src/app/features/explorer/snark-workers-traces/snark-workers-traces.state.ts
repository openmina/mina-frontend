import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { selectExplorerSnarkTracesState } from '@explorer/explorer.state';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import { SnarkWorkerTraceFilter } from '@shared/types/explorer/snark-traces/snark-worker-trace-filters.type';

export interface SnarkWorkersTracesState {
  jobs: SnarkWorkerTraceJob[];
  filter: SnarkWorkerTraceFilter;
  sort: TableSort<SnarkWorkerTraceJob>;
  activeRow: SnarkWorkerTraceJob;
}

const select = <T>(selector: (state: SnarkWorkersTracesState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectExplorerSnarkTracesState,
  selector,
);

export const selectSWTracesJobs = select((state: SnarkWorkersTracesState): SnarkWorkerTraceJob[] => state.jobs);
export const selectSWTracesFilter = select((state: SnarkWorkersTracesState): SnarkWorkerTraceFilter => state.filter);
export const selectSWTracesSort = select((state: SnarkWorkersTracesState): TableSort<SnarkWorkerTraceJob> => state.sort);
export const selectSWTracesActiveRow = select((state: SnarkWorkersTracesState): SnarkWorkerTraceJob => state.activeRow);
