import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { EMPTY, map, switchMap } from 'rxjs';
import {
  DASHBOARD_SPLITS_CLOSE,
  DASHBOARD_SPLITS_GET_SPLITS,
  DASHBOARD_SPLITS_GET_SPLITS_SUCCESS,
  DASHBOARD_SPLITS_MERGE_NODES,
  DASHBOARD_SPLITS_MERGE_NODES_SUCCESS,
  DASHBOARD_SPLITS_SPLIT_NODES,
  DASHBOARD_SPLITS_SPLIT_NODES_SUCCESS,
  DashboardSplitsActions,
  DashboardSplitsClose,
  DashboardSplitsGetSplits,
  DashboardSplitsMergeNodes,
} from '@dashboard/splits/dashboard-splits.actions';
import { DashboardSplitsService } from '@dashboard/splits/dashboard-splits.service';
import { DashboardSplits } from '@shared/types/dashboard/splits/dashboard-splits.type';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { DashboardSplitsState } from '@dashboard/splits/dashboard-splits.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardSplitsEffects extends MinaBaseEffect<DashboardSplitsActions> {

  readonly getSplits$: Effect;
  readonly splitNodes$: Effect;
  readonly mergeNodes$: Effect;

  constructor(private actions$: Actions,
              private splitService: DashboardSplitsService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getSplits$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_SPLITS_GET_SPLITS, DASHBOARD_SPLITS_CLOSE),
      this.latestActionState<DashboardSplitsGetSplits | DashboardSplitsClose>(),
      switchMap(({ action }) =>
        action.type === DASHBOARD_SPLITS_CLOSE
          ? EMPTY
          : this.splitService.getPeers(),
      ),
      map((payload: DashboardSplits) => ({ type: DASHBOARD_SPLITS_GET_SPLITS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, DASHBOARD_SPLITS_GET_SPLITS_SUCCESS, { peers: [], links: [] }),
    ));

    this.splitNodes$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_SPLITS_SPLIT_NODES),
      this.latestStateSlice<DashboardSplitsState, DashboardSplitsMergeNodes>('dashboard.splits'),
      switchMap(state => this.splitService.splitNodes(state.peers)),
      map(() => ({ type: DASHBOARD_SPLITS_SPLIT_NODES_SUCCESS })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, DASHBOARD_SPLITS_SPLIT_NODES_SUCCESS),
    ));

    this.mergeNodes$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_SPLITS_MERGE_NODES),
      this.latestStateSlice<DashboardSplitsState, DashboardSplitsMergeNodes>('dashboard.splits'),
      switchMap(state => this.splitService.mergeNodes(state.peers)),
      map(() => ({ type: DASHBOARD_SPLITS_MERGE_NODES_SUCCESS })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, DASHBOARD_SPLITS_MERGE_NODES_SUCCESS),
    ));
  }
}
