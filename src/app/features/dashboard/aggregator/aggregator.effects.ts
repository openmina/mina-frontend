import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { catchError, filter, map, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { addErrorObservable, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  AggregatorActions,
  AGGREGATOR_CLOSE,
  AGGREGATOR_GET_EARLIEST_BLOCK,
  AGGREGATOR_GET_MESSAGES,
  AGGREGATOR_GET_MESSAGES_SUCCESS,
  AGGREGATOR_INIT,
  AGGREGATOR_SET_ACTIVE_BLOCK,
  AGGREGATOR_SET_EARLIEST_BLOCK,
  AGGREGATOR_UPDATE_NODE_COUNT,
  AggregatorGetEarliestBlock,
  AggregatorGetMessages,
  AggregatorInit,
  AggregatorSetActiveBlock,
} from '@dashboard/aggregator/aggregator.actions';
import { DashboardMessage } from '@shared/types/dashboard/dashboard-message';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import { AggregatorService } from '@dashboard/aggregator/aggregator.service';

@Injectable({
  providedIn: 'root',
})
export class AggregatorEffects extends MinaBaseEffect<AggregatorActions> {

  readonly init$: Effect;
  readonly earliestBlock$: Effect;
  readonly getDashboardMessages$: Effect;
  readonly setActiveBlock$: Effect;
  readonly close$: NonDispatchableEffect;

  private destroy$: Subject<void> = new Subject<void>();
  private streamActive: boolean;
  private waitingForServer: boolean;

  constructor(private router: Router,
              private actions$: Actions,
              private dashboardService: AggregatorService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.earliestBlock$ = createEffect(() => this.actions$.pipe(
      ofType(AGGREGATOR_GET_EARLIEST_BLOCK),
      this.latestActionState<AggregatorGetEarliestBlock>(),
      switchMap(({ action, state }) => {
        return this.dashboardService.getEarliestBlockHeight()
          .pipe(
            switchMap(height => {
              const actions: AggregatorActions[] = [{ type: AGGREGATOR_SET_EARLIEST_BLOCK, payload: { height } }];
              if (!state.dashboard.aggregator.activeBlock) {
                this.router.navigate([Routes.DASHBOARD, Routes.BLOCK, height ?? '']);
                actions.push({ type: AGGREGATOR_SET_ACTIVE_BLOCK, payload: { height } });
                actions.push({ type: AGGREGATOR_INIT });
              }
              return actions;
            }),
          );
      }),
    ));

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(AGGREGATOR_INIT),
      this.latestActionState<AggregatorInit>(),
      switchMap(() =>
        timer(0, 5000).pipe(
          takeUntil(this.destroy$),
          filter(() => !this.waitingForServer),
          map(() => ({ type: AGGREGATOR_GET_MESSAGES })),
        ),
      ),
    ));

    this.getDashboardMessages$ = createEffect(() => this.actions$.pipe(
      ofType(AGGREGATOR_GET_MESSAGES),
      this.latestActionState<AggregatorGetMessages>(),
      tap(({ state }) => this.streamActive = state.dashboard.aggregator.stream),
      tap(() => this.waitingForServer = true),
      switchMap(({ action, state }) => this.dashboardService.getDashboardMessages(action.payload?.height || state.dashboard.aggregator.activeBlock)),
      tap(() => this.waitingForServer = false),
      switchMap((payload: { messages: DashboardMessage[], nodeCount: number }) => [
        { type: AGGREGATOR_GET_MESSAGES_SUCCESS, payload: payload.messages },
        { type: AGGREGATOR_UPDATE_NODE_COUNT, payload: payload.nodeCount },
      ]),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.DEBUGGER)),
    ));

    this.setActiveBlock$ = createEffect(() => this.actions$.pipe(
      ofType(AGGREGATOR_SET_ACTIVE_BLOCK),
      this.latestActionState<AggregatorSetActiveBlock>(),
      filter(({ action }) => action.payload.fetchNew),
      map(({ action }) => ({ type: AGGREGATOR_GET_MESSAGES, payload: { height: action.payload.height } })),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(AGGREGATOR_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.destroy$.next(null);
      }),
    ));
  }
}
