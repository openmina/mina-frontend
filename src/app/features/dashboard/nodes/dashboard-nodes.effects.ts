import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { catchError, EMPTY, filter, finalize, map, mergeMap, repeat, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { addErrorObservable } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  DASHBOARD_NODES_GET_FORKS, DASHBOARD_NODES_GET_FORKS_SUCCESS,
  DASHBOARD_NODES_CLOSE,
  DASHBOARD_NODES_GET_EARLIEST_BLOCK,
  DASHBOARD_NODES_GET_NODE,
  DASHBOARD_NODES_GET_NODE_SUCCESS,
  DASHBOARD_NODES_GET_NODES,
  DASHBOARD_NODES_GET_TRACES_SUCCESS,
  DASHBOARD_NODES_SET_ACTIVE_BLOCK,
  DASHBOARD_NODES_SET_ACTIVE_NODE,
  DASHBOARD_NODES_SET_EARLIEST_BLOCK,
  DashboardNodesActions,
  DashboardNodesClose,
  DashboardNodesGetEarliestBlock,
  DashboardNodesGetNode,
  DashboardNodesGetNodes,
  DashboardNodesSetActiveBlock,
  DashboardNodesSetActiveNode,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { DashboardNodesService } from '@dashboard/nodes/dashboard-nodes.service';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { Router } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { Routes } from '@shared/enums/routes.enum';

@Injectable({
  providedIn: 'root',
})
export class DashboardNodesEffects extends MinaBaseEffect<DashboardNodesActions> {

  readonly earliestBlock$: Effect;
  readonly setActiveBlock$: Effect;
  readonly getNodes$: Effect;
  readonly getNode$: Effect;
  readonly getTraceDetails$: Effect;
  readonly getForks$: Effect;

  constructor(private router: Router,
              private actions$: Actions,
              private nodesService: DashboardNodesService,
              private loadingService: LoadingService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.earliestBlock$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_GET_EARLIEST_BLOCK, DASHBOARD_NODES_CLOSE),
      this.latestActionState<DashboardNodesGetEarliestBlock | DashboardNodesClose>(),
      switchMap(({ state, action }) =>
        action.type === DASHBOARD_NODES_CLOSE
          ? EMPTY
          : this.nodesService.getLatestHeight(state.dashboard.nodes.nodes)
            .pipe(
              switchMap((height: number) => {
                const actions: DashboardNodesActions[] = [{ type: DASHBOARD_NODES_SET_EARLIEST_BLOCK, payload: { height } }];
                if (!state.dashboard.nodes.activeBlock) {
                  this.router.navigate([Routes.DASHBOARD, Routes.NODES, height ?? ''], { queryParamsHandling: 'merge' });
                  actions.push({ type: DASHBOARD_NODES_SET_ACTIVE_BLOCK, payload: { height } });
                }
                return actions;
              }),
            ),
      ),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.GRAPH_QL)),
    ));

    this.setActiveBlock$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_SET_ACTIVE_BLOCK),
      this.latestActionState<DashboardNodesSetActiveBlock>(),
      map(({ action }) => ({ type: DASHBOARD_NODES_GET_NODES, payload: { height: action.payload.height } })),
    ));

    this.getNodes$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_GET_NODES),
      this.latestActionState<DashboardNodesGetNodes>(),
      switchMap(({ action, state }) => state.dashboard.nodes.nodes.map(node =>
        ({ type: DASHBOARD_NODES_GET_NODE, payload: { node, height: action.payload.height } }),
      )),
    ));

    this.getNode$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_GET_NODE),
      this.latestActionState<DashboardNodesGetNode>(),
      tap(() => this.loadingService.addURL()),
      mergeMap(({ action }) => {
        const cancel$ = new Subject<void>();
        return this.nodesService.getNode(action.payload.node, action.payload.height).pipe(
          takeUntil(cancel$),
          takeUntil(this.actions$.pipe(ofType(DASHBOARD_NODES_CLOSE))),
          finalize(() => cancel$.complete()),
        );
      }),
      map((payload: DashboardNode[]) => ({ type: DASHBOARD_NODES_GET_NODE_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.GRAPH_QL)),
    ));

    this.getTraceDetails$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_SET_ACTIVE_NODE),
      this.latestActionState<DashboardNodesSetActiveNode>(),
      filter(({ action }) => !!action.payload.node),
      switchMap(({ action }) => this.nodesService.getBlockTraceGroups(action.payload.node)),
      map((payload: TracingTraceGroup[]) => ({ type: DASHBOARD_NODES_GET_TRACES_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.GRAPH_QL)),
      repeat(),
    ));

    this.getForks$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_GET_FORKS),
      this.latestActionState<DashboardNodesGetNodes>(),
      switchMap(({ state }) => this.nodesService.getForks(state.dashboard.nodes.nodes)),
      map((payload: Pick<DashboardNode, 'name' | 'branch' | 'bestTip'>[]) => ({ type: DASHBOARD_NODES_GET_FORKS_SUCCESS, payload })),
    ));
  }
}
