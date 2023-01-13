import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { BehaviorSubject, catchError, delay, filter, interval, map, mergeMap, repeat, startWith, switchMap, tap, timer } from 'rxjs';
import {
  APP_CHANGE_ACTIVE_NODE,
  APP_GET_DEBUGGER_STATUS,
  APP_GET_NODE_STATUS,
  APP_GET_NODE_STATUS_SUCCESS,
  APP_INIT,
  APP_START_BACKGROUND_CHECKS,
  APP_UPDATE_DEBUGGER_STATUS,
  AppAction,
  AppChangeActiveNode,
  AppGetDebuggerStatus,
  AppGetNodeStatus,
  AppInit,
  AppUpdateDebuggerStatus,
} from '@app/app.actions';
import { BlockService } from '@shared/services/block.service';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { addError, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { GraphQLService } from '@core/services/graph-ql.service';
import { Router } from '@angular/router';
import { FeatureType } from '@shared/types/core/environment/mina-env.type';

const INIT_EFFECTS = '@ngrx/effects/init';

@Injectable({
  providedIn: 'root',
})
export class AppEffects extends MinaBaseEffect<AppAction> {

  readonly ngrxEffectsInit$: Effect;
  readonly init$: Effect;
  readonly backgroundChecks$: Effect;
  readonly onNodeChange$: Effect;
  readonly getNodeStatus$: Effect;
  readonly getDebuggerStatus$: Effect;

  private readonly updateDebuggerStatus = (isOnline: boolean): AppUpdateDebuggerStatus => ({ type: APP_UPDATE_DEBUGGER_STATUS, payload: { isOnline } });
  private readonly monitoringInterval$ = new BehaviorSubject<number>(10000);

  constructor(private actions$: Actions,
              private graphQL: GraphQLService,
              private blockService: BlockService,
              private router: Router,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.ngrxEffectsInit$ = createEffect(() => this.actions$.pipe(
      ofType(INIT_EFFECTS),
      map(() => ({ type: APP_INIT })),
    ));

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(APP_INIT),
      this.latestActionState<AppInit>(),
      tap(({ state }) => this.graphQL.changeGraphQlProvider(state.app.activeNode)),
      map(() => ({ type: APP_START_BACKGROUND_CHECKS })),
    ));

    this.backgroundChecks$ = createEffect(() => this.actions$.pipe(
      ofType(APP_START_BACKGROUND_CHECKS),
      switchMap(() =>
        this.monitoringInterval$.pipe(
          switchMap(value => interval(value)),
          switchMap(() => [
            { type: APP_GET_DEBUGGER_STATUS },
            { type: APP_GET_NODE_STATUS },
          ]),
        ),
      ),
    ));

    this.onNodeChange$ = createEffect(() => this.actions$.pipe(
      ofType(APP_CHANGE_ACTIVE_NODE),
      this.latestActionState<AppChangeActiveNode>(),
      tap(({ state }) => {
        this.graphQL.changeGraphQlProvider(state.app.activeNode);
        this.monitoringInterval$.next(10000);

        const removeParams = (path: string): string => {
          if (path?.includes('?')) {
            return path.split('?')[0];
          }
          return path;
        };
        const activePage = removeParams(this.router.url.split('/')[1]);
        const features = state.app.activeNode.features;
        if (!features.some((feature: FeatureType) => feature === activePage)) {
          this.router.navigate([features[0]]);
        }
      }),
      map(() => ({ type: APP_GET_NODE_STATUS })),
    ));

    this.getNodeStatus$ = createEffect(() => this.actions$.pipe(
      ofType(APP_INIT, APP_GET_NODE_STATUS),
      this.latestActionState<AppInit | AppGetNodeStatus>(),
      mergeMap(() => this.blockService.getNodeStatus()),
      map((payload: NodeStatus) => ({ type: APP_GET_NODE_STATUS_SUCCESS, payload })),
      catchError((error: HttpErrorResponse) => {
        this.monitoringInterval$.next(300000);
        return [
          addError(error, MinaErrorType.GRAPH_QL),
          { type: APP_GET_NODE_STATUS_SUCCESS, payload: { level: 0, status: AppNodeStatusTypes.OFFLINE } },
        ];
      }),
      repeat(),
    ));

    this.getDebuggerStatus$ = createEffect(() => this.actions$.pipe(
      ofType(APP_INIT, APP_GET_DEBUGGER_STATUS),
      this.latestActionState<AppInit | AppGetDebuggerStatus>(),
      filter(({ state }) => !!state.app.activeNode.debugger),
      mergeMap(() => this.blockService.getDebuggerStatus()),
      map(() => this.updateDebuggerStatus(true)),
      catchError((error: HttpErrorResponse) => [
        addError(error, MinaErrorType.DEBUGGER),
        this.updateDebuggerStatus(false),
      ]),
      repeat(),
    ));

  }
}
