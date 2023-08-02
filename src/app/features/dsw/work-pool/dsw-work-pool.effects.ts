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
  DSW_WORK_POOL_CLOSE,
  DSW_WORK_POOL_GET_WORK_POOL,
  DSW_WORK_POOL_GET_WORK_POOL_SUCCESS,
  DswWorkPoolActions,
  DswWorkPoolClose,
  DswWorkPoolGetWorkPool,
} from '@dsw/work-pool/dsw-work-pool.actions';
import { DswWorkPoolService } from '@dsw/work-pool/dsw-work-pool.service';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';

@Injectable({
  providedIn: 'root',
})
export class DswWorkPoolEffects extends MinaBaseEffect<DswWorkPoolActions> {

  readonly getWorkPool$: Effect;

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
  }
}
