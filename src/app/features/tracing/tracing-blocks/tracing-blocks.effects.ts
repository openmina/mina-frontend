import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, filter, map, switchMap } from 'rxjs';
import { Effect } from '@shared/types/store/effect.type';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { TracingBlocksService } from '@tracing/tracing-blocks/tracing-blocks.service';
import {
  TRACING_BLOCKS_CLOSE, TRACING_BLOCKS_GET_DETAILS,
  TRACING_BLOCKS_GET_DETAILS_SUCCESS,
  TRACING_BLOCKS_GET_TRACES,
  TRACING_BLOCKS_GET_TRACES_SUCCESS,
  TRACING_BLOCKS_SELECT_ROW,
  TracingBlocksActions,
  TracingBlocksClose,
  TracingBlocksGetTraces,
  TracingBlocksSelectRow,
} from '@tracing/tracing-blocks/tracing-blocks.actions';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';

@Injectable({
  providedIn: 'root',
})
export class TracingBlocksEffects extends MinaBaseEffect<TracingBlocksActions> {

  readonly getTraces$: Effect;
  readonly selectTrace$: Effect;
  readonly getTraceDetails$: Effect;

  constructor(private actions$: Actions,
              private tracingBlocksService: TracingBlocksService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getTraces$ = createEffect(() => this.actions$.pipe(
      ofType(TRACING_BLOCKS_GET_TRACES, TRACING_BLOCKS_CLOSE),
      this.latestActionState<TracingBlocksGetTraces | TracingBlocksClose>(),
      switchMap(({ action }) =>
        action.type === TRACING_BLOCKS_CLOSE
          ? EMPTY
          : this.tracingBlocksService.getTraces(),
      ),
      map((payload: TracingBlockTrace[]) => ({ type: TRACING_BLOCKS_GET_TRACES_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, TRACING_BLOCKS_GET_TRACES_SUCCESS, []),
    ));

    this.selectTrace$ = createEffect(() => this.actions$.pipe(
      ofType(TRACING_BLOCKS_SELECT_ROW),
      this.latestActionState<TracingBlocksSelectRow>(),
      filter(({ state }) => !!state.tracing.blocks.activeTrace),
      map(() => ({ type: TRACING_BLOCKS_GET_DETAILS })),
    ));

    this.getTraceDetails$ = createEffect(() => this.actions$.pipe(
      ofType(TRACING_BLOCKS_GET_DETAILS, TRACING_BLOCKS_CLOSE),
      this.latestActionState<TracingBlocksSelectRow | TracingBlocksClose>(),
      filter(({ state }) => !!state.tracing.blocks.activeTrace),
      switchMap(({ state, action }) =>
        action.type === TRACING_BLOCKS_CLOSE
          ? EMPTY
          : this.tracingBlocksService.getBlockTraceGroups(state.tracing.blocks.activeTrace.hash),
      ),
      map((payload: TracingTraceGroup[]) => ({ type: TRACING_BLOCKS_GET_DETAILS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, TRACING_BLOCKS_GET_DETAILS_SUCCESS, []),
    ));
  }
}
