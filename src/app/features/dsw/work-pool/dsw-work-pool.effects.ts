import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, filter, forkJoin, map, switchMap, tap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  DSW_WORK_POOL_CLOSE,
  DSW_WORK_POOL_GET_WORK_POOL,
  DSW_WORK_POOL_GET_WORK_POOL_DETAIL,
  DSW_WORK_POOL_GET_WORK_POOL_DETAIL_SUCCESS,
  DSW_WORK_POOL_GET_WORK_POOL_SUCCESS,
  DSW_WORK_POOL_SET_ACTIVE_WORK_POOL,
  DswWorkPoolActions,
  DswWorkPoolClose,
  DswWorkPoolGetWorkPool,
  DswWorkPoolGetWorkPoolDetail,
  DswWorkPoolSetActiveWorkPool,
} from '@dsw/work-pool/dsw-work-pool.actions';
import { DswWorkPoolService } from '@dsw/work-pool/dsw-work-pool.service';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { WorkPoolSpecs } from '@shared/types/dsw/work-pool/work-pool-specs.type';
import { hasValue } from '@shared/helpers/values.helper';
import { WorkPoolDetail } from '@shared/types/dsw/work-pool/work-pool-detail.type';

@Injectable({
  providedIn: 'root',
})
export class DswWorkPoolEffects extends MinaBaseEffect<DswWorkPoolActions> {

  readonly getWorkPool$: Effect;
  readonly selectActiveWorkPool$: Effect;
  readonly getActiveWorkPoolDetail$: Effect;

  private pendingRequest: boolean;

  constructor(private actions$: Actions,
              private dswWorkPoolService: DswWorkPoolService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.getWorkPool$ = createEffect(() => this.actions$.pipe(
      ofType(DSW_WORK_POOL_GET_WORK_POOL, DSW_WORK_POOL_CLOSE),
      this.latestActionState<DswWorkPoolGetWorkPool | DswWorkPoolClose>(),
      filter(({ action }) => !this.pendingRequest),
      tap(({ action }) => {
        if (action.type === DSW_WORK_POOL_CLOSE) {
          this.pendingRequest = true;
        }
      }),
      switchMap(({ action, state }) =>
        action.type === DSW_WORK_POOL_CLOSE
          ? EMPTY
          : this.dswWorkPoolService.getWorkPool(),
      ),
      map((payload: WorkPool[]) => ({ type: DSW_WORK_POOL_GET_WORK_POOL_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GENERIC, DSW_WORK_POOL_GET_WORK_POOL_SUCCESS, []),
      tap(() => this.pendingRequest = false),
    ));

    this.selectActiveWorkPool$ = createEffect(() => this.actions$.pipe(
      ofType(DSW_WORK_POOL_SET_ACTIVE_WORK_POOL),
      this.latestActionState<DswWorkPoolSetActiveWorkPool>(),
      filter(({ action }) => hasValue(action.payload?.id)),
      map(({ action }) => ({ type: DSW_WORK_POOL_GET_WORK_POOL_DETAIL, payload: action.payload })),
    ));

    this.getActiveWorkPoolDetail$ = createEffect(() => this.actions$.pipe(
      ofType(DSW_WORK_POOL_GET_WORK_POOL_DETAIL, DSW_WORK_POOL_CLOSE),
      this.latestActionState<DswWorkPoolGetWorkPoolDetail | DswWorkPoolClose>(),
      filter(({ action }) => hasValue((action as DswWorkPoolGetWorkPoolDetail).payload?.id)),
      switchMap(({ action, state }) =>
        action.type === DSW_WORK_POOL_CLOSE
          ? EMPTY
          : forkJoin([
            this.dswWorkPoolService.getWorkPoolSpecs(state.dsw.workPool.activeWorkPool.id),
            this.dswWorkPoolService.getWorkPoolDetail(state.dsw.workPool.activeWorkPool.id),
          ]),
      ),
      map((payload: [WorkPoolSpecs, WorkPoolDetail]) => ({ type: DSW_WORK_POOL_GET_WORK_POOL_DETAIL_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GENERIC, DSW_WORK_POOL_GET_WORK_POOL_DETAIL_SUCCESS),
    ));
  }
}
