import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { catchError, filter, map, repeat, switchMap } from 'rxjs';
import { Effect } from '@shared/types/store/effect.type';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { TracingBlocksService } from '@tracing/tracing-blocks/tracing-blocks.service';
import {
  TRACING_BLOCKS_GET_DETAILS_SUCCESS,
  TRACING_BLOCKS_GET_TRACES,
  TRACING_BLOCKS_GET_TRACES_SUCCESS,
  TRACING_BLOCKS_SELECT_ROW,
  TracingBlocksActions,
  TracingBlocksSelectRow,
} from '@tracing/tracing-blocks/tracing-blocks.actions';
import { addError, addErrorObservable } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';

@Injectable({
  providedIn: 'root',
})
export class TracingBlocksEffects extends MinaBaseEffect<TracingBlocksActions> {

  readonly getTraces$: Effect;
  readonly getTraceDetails$: Effect;

  constructor(private actions$: Actions,
              private tracingBlocksService: TracingBlocksService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getTraces$ = createEffect(() => this.actions$.pipe(
      ofType(TRACING_BLOCKS_GET_TRACES),
      switchMap(() => this.tracingBlocksService.getTraces()),
      map((payload: TracingBlockTrace[]) => ({ type: TRACING_BLOCKS_GET_TRACES_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: TRACING_BLOCKS_GET_TRACES_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));

    this.getTraceDetails$ = createEffect(() => this.actions$.pipe(
      ofType(TRACING_BLOCKS_SELECT_ROW),
      this.latestActionState<TracingBlocksSelectRow>(),
      filter(({ state }) => !!state.tracing.blocks.activeTrace),
      switchMap(({ action }) => this.tracingBlocksService.getBlockTraceGroups(action.payload.hash)),
      map((payload: TracingTraceGroup[]) => ({ type: TRACING_BLOCKS_GET_DETAILS_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.GRAPH_QL)),
      repeat(),
    ));
  }
}
