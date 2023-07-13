import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, filter, map, switchMap, tap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  DSW_DASHBOARD_CLOSE,
  DSW_DASHBOARD_GET_NODES,
  DSW_DASHBOARD_GET_NODES_SUCCESS,
  DswDashboardActions,
  DswDashboardClose,
  DswDashboardGetNodes,
} from '@dsw/dashboard/dsw-dashboard.actions';
import { DswDashboardService } from '@dsw/dashboard/dsw-dashboard.service';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';

@Injectable({
  providedIn: 'root',
})
export class DswDashboardEffects extends MinaBaseEffect<DswDashboardActions> {

  readonly getNodes$: Effect;

  private pendingRequest: boolean;

  constructor(private actions$: Actions,
              private dswDashboardService: DswDashboardService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.getNodes$ = createEffect(() => this.actions$.pipe(
      ofType(DSW_DASHBOARD_GET_NODES, DSW_DASHBOARD_CLOSE),
      this.latestActionState<DswDashboardGetNodes | DswDashboardClose>(),
      filter(() => !this.pendingRequest),
      tap(({ action }) => {
        if (action.type === DSW_DASHBOARD_GET_NODES) {
          this.pendingRequest = true;
        }
      }),
      switchMap(({ action, state }) =>
        action.type === DSW_DASHBOARD_CLOSE
          ? EMPTY
          : this.dswDashboardService.getNodes(),
      ),
      map((payload: DswDashboardNode[]) => ({ type: DSW_DASHBOARD_GET_NODES_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GENERIC, DSW_DASHBOARD_GET_NODES_SUCCESS, []),
      tap(() => this.pendingRequest = false),
    ));
  }
}
