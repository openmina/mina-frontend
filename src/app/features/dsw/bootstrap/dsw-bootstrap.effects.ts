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
  DSW_BOOTSTRAP_CLOSE,
  DSW_BOOTSTRAP_GET_NODES,
  DSW_BOOTSTRAP_GET_NODES_SUCCESS,
  DswBootstrapActions,
  DswBootstrapClose,
  DswBootstrapGetNodes, DswBootstrapGetNodesSuccess,
} from '@dsw/bootstrap/dsw-bootstrap.actions';
import { DswBootstrapService } from '@dsw/bootstrap/dsw-bootstrap.service';
import { DswBootstrapNode } from '@shared/types/dsw/bootstrap/dsw-bootstrap-node.type';

@Injectable({
  providedIn: 'root',
})
export class DswBootstrapEffects extends MinaBaseEffect<DswBootstrapActions> {

  readonly getNodes$: Effect;

  private pendingRequest: boolean;

  constructor(private actions$: Actions,
              private dswBootstrapService: DswBootstrapService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.getNodes$ = createEffect(() => this.actions$.pipe(
      ofType(DSW_BOOTSTRAP_GET_NODES, DSW_BOOTSTRAP_CLOSE),
      this.latestActionState<DswBootstrapGetNodes | DswBootstrapClose>(),
      filter(({ action }) => (action as any).payload?.force || !this.pendingRequest),
      tap(({ action }) => {
        if (action.type === DSW_BOOTSTRAP_GET_NODES) {
          this.pendingRequest = true;
        }
      }),
      switchMap(({ action, state }) =>
        action.type === DSW_BOOTSTRAP_CLOSE
          ? EMPTY
          : this.dswBootstrapService.getBootstrapNodeTips(),
      ),
      map((payload: DswBootstrapNode[]) => ({ type: DSW_BOOTSTRAP_GET_NODES_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GENERIC, DSW_BOOTSTRAP_GET_NODES_SUCCESS, { blocks: [] }),
      tap(() => this.pendingRequest = false),
    ));
  }
}
