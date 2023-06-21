import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, map, switchMap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { DswActionsService } from '@dsw/actions/dsw-actions.service';
import {
  DSW_ACTIONS_CLOSE,
  DSW_ACTIONS_GET_ACTIONS,
  DSW_ACTIONS_GET_ACTIONS_SUCCESS,
  DSW_ACTIONS_GET_EARLIEST_SLOT,
  DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS,
  DswActionsActions,
  DswActionsClose,
  DswActionsGetActions,
  DswActionsGetEarliestSlot,
} from '@dsw/actions/dsw-actions.actions';
import { DswActionGroup } from '@shared/types/dsw/actions/dsw-action-group.type';
import { DswActionsStats } from '@shared/types/dsw/actions/dsw-actions-stats.type';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DswActionsEffects extends MinaBaseEffect<DswActionsActions> {

  readonly getActions$: Effect;
  readonly getEarliestSlot$: Effect;

  constructor(private router: Router,
              private actions$: Actions,
              private actionsService: DswActionsService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.getEarliestSlot$ = createEffect(() => this.actions$.pipe(
      ofType(DSW_ACTIONS_GET_EARLIEST_SLOT, DSW_ACTIONS_CLOSE),
      this.latestActionState<DswActionsGetEarliestSlot | DswActionsClose>(),
      switchMap(({ action, state }) =>
        action.type === DSW_ACTIONS_CLOSE
          ? EMPTY
          : this.actionsService.getEarliestSlot().pipe(
            switchMap((payload: number) => {
              const actions: DswActionsActions[] = [{ type: DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS, payload }];
              if (state.dsw.actions.activeSlot === undefined) {
                this.router.navigate([Routes.SNARK_WORKER, Routes.ACTIONS, payload ?? ''], { queryParamsHandling: 'merge' });
                actions.push({ type: DSW_ACTIONS_GET_ACTIONS, payload: { slot: payload } });
              }
              return actions;
            }),
          ),
      ),
      catchErrorAndRepeat(MinaErrorType.GENERIC, DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS, null),
    ));

    this.getActions$ = createEffect(() => this.actions$.pipe(
      ofType(DSW_ACTIONS_GET_ACTIONS, DSW_ACTIONS_CLOSE),
      this.latestActionState<DswActionsGetActions | DswActionsClose>(),
      switchMap(({ action, state }) =>
        action.type === DSW_ACTIONS_CLOSE
          ? EMPTY
          : this.actionsService.getActions(state.dsw.actions.activeSlot),
      ),
      map((payload: [DswActionsStats, DswActionGroup[]]) => ({ type: DSW_ACTIONS_GET_ACTIONS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GENERIC, DSW_ACTIONS_GET_ACTIONS_SUCCESS, []),
    ));
  }
}
