import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { map, switchMap, tap } from 'rxjs';
import {
  DASHBOARD_SPLITS_GET_SPLITS,
  DASHBOARD_SPLITS_GET_SPLITS_SUCCESS, DASHBOARD_SPLITS_MERGE_NODES,
  DASHBOARD_SPLITS_SPLIT_NODES,
  DashboardSplitsActions,
  DashboardSplitsGetSplits, DashboardSplitsMergeNodes,
  DashboardSplitsSplitNodes,
} from '@dashboard/splits/dashboard-splits.actions';
import { DashboardSplitsService } from '@dashboard/splits/dashboard-splits.service';
import { LoadingService } from '@core/services/loading.service';
import { DashboardSplits } from '@shared/types/dashboard/splits/dashboard-splits.type';
import { createNonDispatchableEffect } from '@shared/constants/store-functions';

@Injectable({
  providedIn: 'root',
})
export class DashboardSplitsEffects extends MinaBaseEffect<DashboardSplitsActions> {

  readonly getSplits$: Effect;
  readonly splitNodes$: NonDispatchableEffect;
  readonly mergeNodes$: NonDispatchableEffect;

  constructor(private actions$: Actions,
              private splitService: DashboardSplitsService,
              private loadingService: LoadingService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getSplits$ = createEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_SPLITS_GET_SPLITS),
      this.latestActionState<DashboardSplitsGetSplits>(),
      tap(() => this.loadingService.addURL()),
      switchMap(({ state }) => this.splitService.getPeers()),
      map((payload: DashboardSplits) => ({ type: DASHBOARD_SPLITS_GET_SPLITS_SUCCESS, payload })),
      tap(() => this.loadingService.removeURL()),
    ));

    this.splitNodes$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_SPLITS_SPLIT_NODES),
      this.latestActionState<DashboardSplitsSplitNodes>(),
      switchMap(({ state }) => this.splitService.splitNodes(state.dashboard.splits.peers)),
    ));
    this.mergeNodes$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(DASHBOARD_SPLITS_MERGE_NODES),
      this.latestActionState<DashboardSplitsMergeNodes>(),
      switchMap(({ state }) => this.splitService.mergeNodes(state.dashboard.splits.peers)),
    ));
  }
}
