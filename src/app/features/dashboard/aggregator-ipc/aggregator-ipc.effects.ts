import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { catchError, filter, map, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { addErrorObservable, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import {
  AGGREGATOR_IPC_CLOSE,
  AGGREGATOR_IPC_GET_EARLIEST_BLOCK,
  AGGREGATOR_IPC_GET_MESSAGES,
  AGGREGATOR_IPC_GET_MESSAGES_SUCCESS,
  AGGREGATOR_IPC_INIT,
  AGGREGATOR_IPC_SET_ACTIVE_BLOCK,
  AGGREGATOR_IPC_SET_EARLIEST_BLOCK,
  AGGREGATOR_IPC_UPDATE_NODE_COUNT,
  AggregatorIpcActions,
  AggregatorIpcGetEarliestBlock,
  AggregatorIpcGetMessages,
  AggregatorIpcInit,
  AggregatorIpcSetActiveBlock,
} from '@dashboard/aggregator-ipc/aggregator-ipc.actions';
import { AggregatorIpcService } from '@dashboard/aggregator-ipc/aggregator-ipc.service';
import { AggregatorIpc } from '@shared/types/dashboard/aggregator-ipc/aggregator-ipc.type';
import { hasValue } from '@shared/helpers/values.helper';

@Injectable({
  providedIn: 'root',
})
export class AggregatorIpcEffects extends MinaBaseEffect<AggregatorIpcActions> {

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
              private aggregatorIpcService: AggregatorIpcService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.earliestBlock$ = createEffect(() => this.actions$.pipe(
      ofType(AGGREGATOR_IPC_GET_EARLIEST_BLOCK),
      this.latestActionState<AggregatorIpcGetEarliestBlock>(),
      switchMap(({ action, state }) => {
        return this.aggregatorIpcService.getEarliestBlockHeight()
          .pipe(
            filter(hasValue),
            switchMap(height => {
              const actions: AggregatorIpcActions[] = [{ type: AGGREGATOR_IPC_SET_EARLIEST_BLOCK, payload: { height } }];
              if (!state.dashboard.aggregatorIpc.activeBlock) {
                this.router.navigate([Routes.DASHBOARD, Routes.LIBP2P, height ?? '']);
                actions.push({ type: AGGREGATOR_IPC_SET_ACTIVE_BLOCK, payload: { height } });
                actions.push({ type: AGGREGATOR_IPC_INIT });
              }
              return actions;
            }),
          );
      }),
    ));

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(AGGREGATOR_IPC_INIT),
      this.latestActionState<AggregatorIpcInit>(),
      switchMap(() =>
        timer(0, 5000).pipe(
          takeUntil(this.destroy$),
          filter(() => !this.waitingForServer),
          map(() => ({ type: AGGREGATOR_IPC_GET_MESSAGES })),
        ),
      ),
    ));

    this.getDashboardMessages$ = createEffect(() => this.actions$.pipe(
      ofType(AGGREGATOR_IPC_GET_MESSAGES),
      this.latestActionState<AggregatorIpcGetMessages>(),
      tap(({ state }) => this.streamActive = state.dashboard.aggregatorIpc.stream),
      tap(() => this.waitingForServer = true),
      switchMap(({ action, state }) => this.aggregatorIpcService.getAggregatorMessages(action.payload?.height || state.dashboard.aggregatorIpc.activeBlock)),
      tap(() => this.waitingForServer = false),
      switchMap((payload: { messages: AggregatorIpc[], nodeCount: number }) => [
        { type: AGGREGATOR_IPC_GET_MESSAGES_SUCCESS, payload: payload.messages },
        { type: AGGREGATOR_IPC_UPDATE_NODE_COUNT, payload: payload.nodeCount },
      ]),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.DEBUGGER)),
    ));

    this.setActiveBlock$ = createEffect(() => this.actions$.pipe(
      ofType(AGGREGATOR_IPC_SET_ACTIVE_BLOCK),
      this.latestActionState<AggregatorIpcSetActiveBlock>(),
      filter(({ action }) => action.payload.fetchNew),
      map(({ action }) => ({ type: AGGREGATOR_IPC_GET_MESSAGES, payload: { height: action.payload.height } })),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(AGGREGATOR_IPC_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.destroy$.next(null);
      }),
    ));
  }
}
