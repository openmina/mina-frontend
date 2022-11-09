import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { catchError, filter, map, mergeMap, repeat, switchMap, tap, timer } from 'rxjs';
import {
  APP_GET_DEBUGGER_STATUS,
  APP_GET_NODE_STATUS,
  APP_GET_NODE_STATUS_SUCCESS,
  APP_INIT,
  APP_UPDATE_DEBUGGER_STATUS,
  AppAction,
  AppGetDebuggerStatus,
  AppGetNodeStatus,
  AppUpdateDebuggerStatus,
} from '@app/app.actions';
import { BlockService } from '@shared/services/block.service';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { addError } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { CONFIG } from '@shared/constants/config';

@Injectable({
  providedIn: 'root',
})
export class AppEffects extends MinaBaseEffect<AppAction> {

  readonly init$: Effect;
  readonly getNodeStatus$: Effect;
  readonly getDebuggerStatus$: Effect;

  private readonly updateDebuggerStatus = (isOnline: boolean): AppUpdateDebuggerStatus => ({ type: APP_UPDATE_DEBUGGER_STATUS, payload: { isOnline } });

  constructor(private actions$: Actions,
              private blockService: BlockService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(APP_INIT),
      switchMap(() =>
        timer(0, 10000).pipe(
          switchMap(() => [
            { type: APP_GET_NODE_STATUS },
            { type: APP_GET_DEBUGGER_STATUS },
          ]),
        ),
      ),
    ));

    this.getNodeStatus$ = createEffect(() => this.actions$.pipe(
      ofType(APP_GET_NODE_STATUS),
      this.latestActionState<AppGetNodeStatus>(),
      mergeMap(() => this.blockService.getNodeStatus()),
      map((payload: NodeStatus) => ({ type: APP_GET_NODE_STATUS_SUCCESS, payload })),
      catchError((error: HttpErrorResponse) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: APP_GET_NODE_STATUS_SUCCESS, payload: { level: 0, status: AppNodeStatusTypes.OFFLINE } },
      ]),
      repeat(),
    ));

    this.getDebuggerStatus$ = createEffect(() => this.actions$.pipe(
      ofType(APP_GET_DEBUGGER_STATUS),
      this.latestActionState<AppGetDebuggerStatus>(),
      filter(() => !!CONFIG.debugger),
      mergeMap(() => this.blockService.getDebuggerStatus()),
      map(() => this.updateDebuggerStatus(true)),
      catchError((error: HttpErrorResponse) => [
        addError(error, MinaErrorType.DEBUGGER),
        this.updateDebuggerStatus(false),
      ]),
      repeat(),
    ));

  }
}
