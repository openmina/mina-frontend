import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, filter, map, switchMap, tap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { DswLiveService } from '@dsw/live/dsw-live.service';
import { DSW_LIVE_CLOSE, DSW_LIVE_GET_NODES, DSW_LIVE_GET_NODES_SUCCESS, DswLiveActions, DswLiveClose, DswLiveGetNodes } from '@dsw/live/dsw-live.actions';
import { DswLiveNode } from '@shared/types/dsw/live/dsw-live-node.type';

@Injectable({
  providedIn: 'root',
})
export class DswLiveEffects extends MinaBaseEffect<DswLiveActions> {

  readonly getNodes$: Effect;

  private pendingRequest: boolean;

  constructor(private actions$: Actions,
              private dswLiveService: DswLiveService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.getNodes$ = createEffect(() => this.actions$.pipe(
      ofType(DSW_LIVE_GET_NODES, DSW_LIVE_CLOSE),
      this.latestActionState<DswLiveGetNodes | DswLiveClose>(),
      filter(({ action }) => (action as any).payload?.force || !this.pendingRequest),
      tap(({ action }) => {
        if (action.type === DSW_LIVE_GET_NODES) {
          this.pendingRequest = true;
        }
      }),
      switchMap(({ action, state }) =>
        action.type === DSW_LIVE_CLOSE
          ? EMPTY
          : this.dswLiveService.getLiveNodeTips(),
      ),
      map((payload: DswLiveNode[]) => ({ type: DSW_LIVE_GET_NODES_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GENERIC, DSW_LIVE_GET_NODES_SUCCESS, { blocks: [], events: [] }),
      tap(() => this.pendingRequest = false),
    ));
  }
}
