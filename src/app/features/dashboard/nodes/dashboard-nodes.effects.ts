import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { catchError, filter, map, repeat, switchMap } from 'rxjs';
import { addErrorObservable } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  DASHBOARD_NODES_GET_NODES,
  DASHBOARD_NODES_GET_NODES_SUCCESS,
  DASHBOARD_NODES_GET_TRACES_SUCCESS,
  DASHBOARD_NODES_SET_ACTIVE_BLOCK,
  DASHBOARD_NODES_SET_ACTIVE_NODE,
  DashboardNodesActions,
  DashboardNodesGetNodes,
  DashboardNodesSetActiveBlock,
  DashboardNodesSetActiveNode,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { DashboardNodesService } from '@dashboard/nodes/dashboard-nodes.service';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { Router } from '@angular/router';
import { CONFIG } from '@shared/constants/config';

@Injectable({
  providedIn: 'root',
})
export class DashboardNodesEffects extends MinaBaseEffect<DashboardNodesActions> {

  readonly earliestBlock$: Effect;
  readonly setActiveBlock$: Effect;
  readonly getDashboardMessages$: Effect;
  readonly getTraceDetails$: Effect;

  constructor(private router: Router,
              private actions$: Actions,
              private nodesService: DashboardNodesService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    // TODO: do we need this in the future? Can we eliminate? This is Adrian's implementation of the aggregator
    // this.earliestBlock$ = createEffect(() => this.actions$.pipe(
    //   ofType(DASHBOARD_NODES_GET_EARLIEST_BLOCK),
    //   this.latestActionState<DashboardNodesGetEarliestBlock>(),
    //   switchMap(({ state }) => {
    //     return this.nodesService.getLatestHeight()
    //       .pipe(
    //         switchMap((height: number) => {
    //           const actions: DashboardNodesActions[] = [{ type: DASHBOARD_NODES_SET_EARLIEST_BLOCK, payload: { height } }];
    //           if (!state.dashboard.nodes.activeBlock) {
    //             this.router.navigate([Routes.DASHBOARD, Routes.NODES, height ?? '']);
    //             actions.push({ type: DASHBOARD_NODES_SET_ACTIVE_BLOCK, payload: { height } });
    //           }
    //           return actions;
    //         }),
    //       );
    //   }),
    // ));

    this.setActiveBlock$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_SET_ACTIVE_BLOCK),
      this.latestActionState<DashboardNodesSetActiveBlock>(),
      map(({ action }) => ({ type: DASHBOARD_NODES_GET_NODES, payload: { height: action.payload.height } })),
    ));

    this.getDashboardMessages$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_GET_NODES),
      this.latestActionState<DashboardNodesGetNodes>(),
      switchMap(({ action, state }) => this.nodesService.getNodes(state.app.nodes)),
      map((payload: DashboardNode[]) => ({ type: DASHBOARD_NODES_GET_NODES_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.GRAPH_QL)),
      repeat(),
    ));

    this.getTraceDetails$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_NODES_SET_ACTIVE_NODE),
      this.latestActionState<DashboardNodesSetActiveNode>(),
      filter(({ state }) => !!state.dashboard.nodes.activeNode),
      switchMap(({ action }) => this.nodesService.getBlockTraceGroups(action.payload)),
      map((payload: TracingTraceGroup[]) => ({ type: DASHBOARD_NODES_GET_TRACES_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.GRAPH_QL)),
      repeat(),
    ));

  }
}
