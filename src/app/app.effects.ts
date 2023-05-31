import { Injectable, NgZone } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { BehaviorSubject, catchError, filter, interval, map, mergeMap, repeat, switchMap, tap } from 'rxjs';
import {
  APP_CHANGE_ACTIVE_NODE,
  APP_GET_DEBUGGER_STATUS,
  APP_GET_NODE_STATUS,
  APP_GET_NODE_STATUS_SUCCESS,
  APP_INIT,
  APP_INIT_SUCCESS,
  APP_START_BACKGROUND_CHECKS,
  APP_UPDATE_DEBUGGER_STATUS,
  AppActions,
  AppChangeActiveNode,
  AppGetDebuggerStatus,
  AppGetNodeStatus,
  AppInit,
  AppInitSuccess,
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
import { FeatureType, MinaNode } from '@shared/types/core/environment/mina-env.type';
import { withLatestFrom } from 'rxjs/operators';
import { removeParamsFromURL } from '@shared/helpers/router.helper';
import { AppService } from './app.service';
import { getFirstFeature, isFeatureEnabled } from '@shared/constants/config';
import { TracingGraphQlService } from '@core/services/tracing-graph-ql.service';
import { ApolloService } from '@core/services/apollo.service';

const INIT_EFFECTS = '@ngrx/effects/init';

@Injectable({
  providedIn: 'root',
})
export class AppEffects extends MinaBaseEffect<AppActions> {

  readonly initEffects$: Effect;
  readonly init$: Effect;
  readonly initSuccess$: Effect;
  readonly backgroundChecks1$: Effect;
  readonly backgroundChecks2$: Effect;
  readonly onNodeChange$: Effect;
  readonly getNodeStatus$: Effect;
  readonly getDebuggerStatus$: Effect;
  readonly zoneDebugEffects$: NonDispatchableEffect;

  private readonly updateDebuggerStatus = (isOnline: boolean): AppUpdateDebuggerStatus => ({ type: APP_UPDATE_DEBUGGER_STATUS, payload: { isOnline } });
  private readonly nodeCheckInterval$ = new BehaviorSubject<number>(10000);
  private readonly debuggerCheckInterval$ = new BehaviorSubject<number>(10000);

  constructor(private actions$: Actions,
              private appService: AppService,
              private graphQL: GraphQLService,
              private tracingGQL: TracingGraphQlService,
              private apolloService: ApolloService,
              private blockService: BlockService,
              private router: Router,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.initEffects$ = createEffect(() => this.actions$.pipe(
      ofType(INIT_EFFECTS),
      map(() => ({ type: APP_INIT })),
    ));

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(APP_INIT),
      switchMap(() => this.appService.getNodes()),
      switchMap((nodes: MinaNode[]) => this.appService.getActiveNode(nodes).pipe(
        map((activeNode: MinaNode) => ({ activeNode, nodes })),
      )),
      map((payload: { activeNode: MinaNode, nodes: MinaNode[] }) => ({ type: APP_INIT_SUCCESS, payload })),
    ));

    this.initSuccess$ = createEffect(() => this.actions$.pipe(
      ofType(APP_INIT_SUCCESS),
      this.latestActionState<AppInitSuccess>(),
      tap(({ state }) => this.changeGqlProvider(state.app.activeNode)),
      map(() => ({ type: APP_START_BACKGROUND_CHECKS })),
    ));

    this.backgroundChecks1$ = createEffect(() => this.actions$.pipe(
      ofType(APP_START_BACKGROUND_CHECKS),
      switchMap(() =>
        this.nodeCheckInterval$.pipe(
          switchMap(value => interval(value)),
          map(() => ({ type: APP_GET_NODE_STATUS })),
        ),
      ),
    ));

    this.backgroundChecks2$ = createEffect(() => this.actions$.pipe(
      ofType(APP_START_BACKGROUND_CHECKS),
      switchMap(() =>
        this.debuggerCheckInterval$.pipe(
          switchMap(value => interval(value)),
          map(() => ({ type: APP_GET_DEBUGGER_STATUS })),
        ),
      ),
    ));

    this.onNodeChange$ = createEffect(() => this.actions$.pipe(
      ofType(APP_CHANGE_ACTIVE_NODE),
      this.latestActionState<AppChangeActiveNode>(),
      tap(({ state }) => {
        this.changeGqlProvider(state.app.activeNode);
        this.nodeCheckInterval$.next(10000);
        const activePage = removeParamsFromURL(this.router.url.split('/')[1]) as FeatureType;
        this.router.navigate([], {
          queryParams: { node: state.app.activeNode.name },
          queryParamsHandling: 'merge',
        });
        if (!isFeatureEnabled(state.app.activeNode, activePage)) {
          this.router.navigate([getFirstFeature(state.app.activeNode)]);
        }
      }),
      map(() => ({ type: APP_GET_NODE_STATUS })),
    ));

    this.getNodeStatus$ = createEffect(() => this.actions$.pipe(
      ofType(APP_INIT_SUCCESS, APP_GET_NODE_STATUS),
      this.latestActionState<AppInit | AppGetNodeStatus>(),
      filter(({ state }) => !location.pathname.includes('/dashboard/')),
      mergeMap(() => this.blockService.getNodeStatus()),
      map((payload: NodeStatus) => ({ type: APP_GET_NODE_STATUS_SUCCESS, payload })),
      catchError((error: HttpErrorResponse) => {
        this.nodeCheckInterval$.next(300000);
        return [
          addError(error, MinaErrorType.GRAPH_QL),
          { type: APP_GET_NODE_STATUS_SUCCESS, payload: { level: 0, status: AppNodeStatusTypes.OFFLINE } },
        ];
      }),
      repeat(),
    ));

    this.getDebuggerStatus$ = createEffect(() => this.actions$.pipe(
      ofType(APP_INIT_SUCCESS, APP_GET_DEBUGGER_STATUS),
      this.latestActionState<AppInit | AppGetDebuggerStatus>(),
      filter(({ state }) => !!state.app.activeNode.debugger),
      filter(({ state }) => !location.pathname.includes('/dashboard/')),
      mergeMap(() => this.blockService.getDebuggerStatus()),
      map(() => this.updateDebuggerStatus(true)),
      catchError((error: HttpErrorResponse) => {
        this.debuggerCheckInterval$.next(300000);
        return [
          addError(error, MinaErrorType.DEBUGGER),
          this.updateDebuggerStatus(false),
        ];
      }),
      repeat(),
    ));

    // effect to debug falling outside of zone
    this.zoneDebugEffects$ = createNonDispatchableEffect(() => this.actions$
      .pipe(
        withLatestFrom(this.store, (action, state) => ({ action, state })),
        tap(({ action, state }) => {
          if (!NgZone.isInAngularZone()) {
            console.error('[zone][debug]', NgZone.isInAngularZone(), action);
          }
        }),
      ),
    );
  }

  private changeGqlProvider(node: MinaNode): void {
    this.apolloService.changeGraphQlProvider(node);
    this.graphQL.changeGraphQlProvider(node);
    this.tracingGQL.changeGraphQlProvider(node);
  }
}
