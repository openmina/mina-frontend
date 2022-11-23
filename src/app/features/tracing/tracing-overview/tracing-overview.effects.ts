import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { TracingOverviewService } from '@tracing/tracing-overview/tracing-overview.service';
import {
  TRACING_OVERVIEW_GET_CHECKPOINTS,
  TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS,
  TracingOverviewActions,
} from '@tracing/tracing-overview/tracing-overview.actions';
import { catchError, map, repeat, switchMap } from 'rxjs';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { addError } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';

@Injectable({
  providedIn: 'root',
})
export class TracingOverviewEffects extends MinaBaseEffect<TracingOverviewActions> {

  readonly getCheckpoints$: Effect;

  // readonly getTraceDetails$: Effect;

  constructor(private actions$: Actions,
              private tracingOverviewService: TracingOverviewService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getCheckpoints$ = createEffect(() => this.actions$.pipe(
      ofType(TRACING_OVERVIEW_GET_CHECKPOINTS),
      switchMap(() => this.tracingOverviewService.getStatistics()),
      map((payload: TracingOverviewCheckpoint[]) => ({ type: TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));

    // this.getTraceDetails$ = createEffect(() => this.actions$.pipe(
    //   ofType(TRACING_BLOCKS_SELECT_ROW),
    //   this.latestActionState<TracingBlocksSelectRow>(),
    //   filter(({ state }) => !!state.tracing.blocks.activeTrace),
    //   switchMap(({ action }) => this.tracingOverviewService.getBlockTraceGroups(action.payload.hash)),
    //   map((payload: TracingTraceGroup[]) => ({ type: TRACING_BLOCKS_GET_DETAILS_SUCCESS, payload })),
    // ));
  }
}
