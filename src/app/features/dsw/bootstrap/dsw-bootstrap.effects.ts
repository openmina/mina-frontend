import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, map, switchMap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import {
  DSW_BOOTSTRAP_CLOSE,
  DSW_BOOTSTRAP_GET_BLOCKS,
  DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS,
  DswBootstrapActions,
  DswBootstrapClose,
  DswBootstrapGetBlocks,
} from '@dsw/bootstrap/dsw-bootstrap.actions';
import { DswBootstrapService } from '@dsw/bootstrap/dsw-bootstrap.service';

@Injectable({
  providedIn: 'root',
})
export class DswBootstrapEffects extends MinaBaseEffect<DswBootstrapActions> {

  readonly getBlocks$: Effect;

  constructor(private actions$: Actions,
              private dswBootstrapService: DswBootstrapService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    //TODO: add to loading bar
    this.getBlocks$ = createEffect(() => this.actions$.pipe(
      ofType(DSW_BOOTSTRAP_GET_BLOCKS, DSW_BOOTSTRAP_CLOSE),
      this.latestActionState<DswBootstrapGetBlocks | DswBootstrapClose>(),
      switchMap(({ action, state }) =>
        action.type === DSW_BOOTSTRAP_CLOSE
          ? EMPTY
          : this.dswBootstrapService.getBlocks(),
      ),
      map((payload: DswDashboardNode) => ({ type: DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GENERIC, DSW_BOOTSTRAP_GET_BLOCKS_SUCCESS, { blocks: [] }),
    ));
  }
}
