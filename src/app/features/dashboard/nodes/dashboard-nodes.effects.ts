import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { catchError, debounceTime, EMPTY, filter, finalize, map, mergeMap, Subject, switchMap, takeUntil } from 'rxjs';
import { addErrorObservable, catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  DASHBOARD_NODES_CLOSE,
  DASHBOARD_NODES_GET_EARLIEST_BLOCK,
  DASHBOARD_NODES_GET_FORKS,
  DASHBOARD_NODES_GET_FORKS_SUCCESS,
  DASHBOARD_NODES_GET_NODE,
  DASHBOARD_NODES_GET_NODE_SUCCESS,
  DASHBOARD_NODES_GET_NODES,
  DASHBOARD_NODES_GET_TRACES,
  DASHBOARD_NODES_GET_TRACES_SUCCESS,
  DASHBOARD_NODES_INIT,
  DASHBOARD_NODES_INIT_SUCCESS,
  DASHBOARD_NODES_SET_ACTIVE_BLOCK,
  DASHBOARD_NODES_SET_ACTIVE_NODE,
  DASHBOARD_NODES_SET_EARLIEST_BLOCK,
  DashboardNodesActions,
  DashboardNodesClose,
  DashboardNodesGetEarliestBlock,
  DashboardNodesGetForks,
  DashboardNodesGetNode,
  DashboardNodesGetNodes,
  DashboardNodesGetTraces,
  DashboardNodesInit,
  DashboardNodesInitSuccess,
  DashboardNodesSetActiveBlock,
  DashboardNodesSetActiveNode,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { DashboardNodesService } from '@dashboard/nodes/dashboard-nodes.service';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { DashboardFork } from '@shared/types/dashboard/node-list/dashboard-fork.type';
import { DashboardNodesState } from '@dashboard/nodes/dashboard-nodes.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardNodesEffects extends MinaBaseEffect<DashboardNodesActions> {

  readonly init$: Effect;
  readonly earliestBlock$: Effect;
  readonly setActiveBlock$: Effect;
  readonly setActiveNode$: Effect;
  readonly getNodes$: Effect;
  readonly getNode$: Effect;
  readonly getTraceDetails$: Effect;
  readonly getForks$: Effect;

  constructor(private router: Router,
              private actions$: Actions,
              private nodesService: DashboardNodesService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_INIT),
      this.latestActionState<DashboardNodesInit | DashboardNodesClose>(),
      switchMap(({ action }) =>
        action.type === DASHBOARD_NODES_CLOSE
          ? EMPTY
          : this.nodesService.getNodes(),
      ),
      map((nodes: DashboardNode[]) => ({ type: DASHBOARD_NODES_INIT_SUCCESS, payload: { nodes } })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, DASHBOARD_NODES_INIT_SUCCESS, { nodes: [] }),
    ));

    this.earliestBlock$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_GET_EARLIEST_BLOCK, DASHBOARD_NODES_CLOSE),
      this.latestActionState<DashboardNodesGetEarliestBlock | DashboardNodesClose>(),
      switchMap(({ state, action }) =>
        action.type === DASHBOARD_NODES_CLOSE
          ? EMPTY
          : this.nodesService.getLatestGlobalSlot(state.dashboard.nodes.nodes)
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
      debounceTime(100),
      this.latestActionState<DashboardNodesSetActiveBlock>(),
      map(({ action }) => ({ type: DASHBOARD_NODES_GET_NODES, payload: { height: action.payload.height } })),
    ));

    this.getNodes$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_GET_NODES, DASHBOARD_NODES_INIT_SUCCESS),
      this.latestStateSlice<DashboardNodesState, DashboardNodesGetNodes | DashboardNodesInitSuccess>('dashboard.nodes'),
      filter(state => !!state.nodes.length),
      switchMap(state => state.nodes.map(node =>
        ({ type: DASHBOARD_NODES_GET_NODE, payload: { node, height: state.activeBlock } }),
      )),
    ));

    this.getNode$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_GET_NODE),
      this.latestActionState<DashboardNodesGetNode>(),
      filter(({ state }) => !!state.dashboard.nodes.activeBlock),
      mergeMap(({ action }) => {
        const cancel$ = new Subject<void>();
        return this.nodesService.getNode(action.payload.node, action.payload.height).pipe(
          takeUntil(cancel$),
          takeUntil(this.actions$.pipe(ofType(DASHBOARD_NODES_CLOSE))),
          finalize(() => {
            cancel$.complete();
          }),
        );
      }),
      map((payload: DashboardNode[]) => ({ type: DASHBOARD_NODES_GET_NODE_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.GRAPH_QL)),
    ));

    this.setActiveNode$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_SET_ACTIVE_NODE),
      this.latestStateSlice<DashboardNodesState, DashboardNodesSetActiveNode>('dashboard.nodes'),
      filter(state => !!state.activeNode),
      map(() => ({ type: DASHBOARD_NODES_GET_TRACES })),
    ));

    this.getTraceDetails$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_GET_TRACES),
      this.latestStateSlice<DashboardNodesState, DashboardNodesGetTraces>('dashboard.nodes'),
      switchMap(state => this.nodesService.getBlockTraceGroups(state.activeNode)),
      map((payload: TracingTraceGroup[]) => ({ type: DASHBOARD_NODES_GET_TRACES_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, DASHBOARD_NODES_GET_TRACES_SUCCESS, []),
    ));

    this.getForks$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_GET_FORKS),
      this.latestActionState<DashboardNodesGetForks>(),
      switchMap(({ state }) => this.nodesService.getForks(state.dashboard.nodes.nodes)),
      map((payload: DashboardFork[]) => ({ type: DASHBOARD_NODES_GET_FORKS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, DASHBOARD_NODES_GET_FORKS_SUCCESS, []),
    ));
  }
}
