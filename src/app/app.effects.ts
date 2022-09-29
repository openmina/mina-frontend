import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/types/store/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { catchError, map, mergeMap, repeat, switchMap, timer } from 'rxjs';
import { APP_GET_NODE_STATUS, APP_GET_NODE_STATUS_SUCCESS, APP_INIT, AppAction, AppGetNodeStatus } from '@app/app.actions';
import { BlockService } from '@shared/services/block.service';
import { AppNodeStatus } from '@shared/types/app/app-node-status.type';
import { ADD_ERROR } from '@error-preview/error-preview.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppEffects extends MinaBaseEffect<AppAction> {

  readonly init$: Effect;
  readonly getNodeStatus$: Effect;

  constructor(private actions$: Actions,
              private blockService: BlockService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(APP_INIT),
      switchMap(() =>
        timer(0, 10000).pipe(
          map(() => ({ type: APP_GET_NODE_STATUS })),
        ),
      ),
    ));

    this.getNodeStatus$ = createEffect(() => this.actions$.pipe(
      ofType(APP_GET_NODE_STATUS),
      this.latestActionState<AppGetNodeStatus>(),
      mergeMap(() => this.blockService.getNodeStatus()),
      map((payload: { lastBlockLevel: number, status: AppNodeStatus, timestamp: number }) => ({ type: APP_GET_NODE_STATUS_SUCCESS, payload })),
      catchError((error: HttpErrorResponse) => [
        { type: ADD_ERROR, payload: { title: 'Node status', message: error.message, status: error.status ? `${error.status} ${error.statusText} - ` : null, timestamp: Date.now() } },
        { type: APP_GET_NODE_STATUS_SUCCESS, payload: { level: 0, status: AppNodeStatus.OFFLINE } },
      ]),
      repeat(),
    ));

  }
}
