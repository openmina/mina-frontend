import { MinaState } from '@app/app.setup';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { selectTracingBlocksState } from '@tracing/tracing.state';

export interface TracingBlocksState {
  traces: TracingBlockTrace[];
  activeTrace: TracingBlockTrace;
  activeTraceGroups: TracingTraceGroup[];
}

const select = <T>(selector: (state: TracingBlocksState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectTracingBlocksState,
  selector,
);

export const selectTracingTraces = select((state: TracingBlocksState): TracingBlockTrace[] => state.traces);
export const selectTracingActiveTrace = select((state: TracingBlocksState): TracingBlockTrace => state.activeTrace);
export const selectTracingActiveTraceDetails = select((state: TracingBlocksState): { activeTrace: TracingBlockTrace, activeTraceGroups: TracingTraceGroup[] } => ({
  activeTrace: state.activeTrace,
  activeTraceGroups: state.activeTraceGroups,
}));
export const selectTracingActiveTraceGroups = select((state: TracingBlocksState): TracingTraceGroup[] => state.activeTraceGroups);
