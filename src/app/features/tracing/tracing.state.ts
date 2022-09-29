import { MinaState } from '@app/app.setup';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { TracingBlocksState } from '@tracing/tracing-blocks/tracing-blocks.state';
import { TracingOverviewState } from '@tracing/tracing-overview/tracing-overview.state';

export interface TracingState {
  blocks: TracingBlocksState;
  overview: TracingOverviewState;
}

const select = <T>(selector: (state: TracingState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectTracingState,
  selector,
);

export const selectTracingState = createFeatureSelector<TracingState>('tracing');
export const selectTracingBlocksState = select((state: TracingState): TracingBlocksState => state.blocks);
export const selectTracingOverviewState = select((state: TracingState): TracingOverviewState => state.overview);
