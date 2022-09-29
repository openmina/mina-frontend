import { ActionReducer, combineReducers } from '@ngrx/store';
import { TracingState } from '@tracing/tracing.state';
import * as fromBlocks from '@tracing/tracing-blocks/tracing-blocks.reducer';
import * as fromOverview from '@tracing/tracing-overview/tracing-overview.reducer';
import { TracingBlocksAction, TracingBlocksActions } from '@tracing/tracing-blocks/tracing-blocks.actions';
import { TracingOverviewAction, TracingOverviewActions } from '@tracing/tracing-overview/tracing-overview.actions';

export type TracingActions = TracingBlocksActions & TracingOverviewActions;
export type TracingAction = TracingBlocksAction & TracingOverviewAction;

export const reducer: ActionReducer<TracingState, TracingActions> = combineReducers<TracingState, TracingActions>({
  blocks: fromBlocks.reducer,
  overview: fromOverview.reducer,
});
