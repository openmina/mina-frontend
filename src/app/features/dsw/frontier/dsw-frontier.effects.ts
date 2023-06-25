import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, map, switchMap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { DswFrontierService } from '@dsw/frontier/dsw-frontier.service';
import {
  DSW_FRONTIER_CLOSE,
  DSW_FRONTIER_GET_LOGS,
  DSW_FRONTIER_GET_LOGS_SUCCESS,
  DswFrontierActions,
  DswFrontierClose,
  DswFrontierGetLogs,
} from '@dsw/frontier/dsw-frontier.actions';
import { DswFrontierLog } from '@shared/types/dsw/frontier/dsw-frontier-log.type';

@Injectable({
  providedIn: 'root',
})
export class DswFrontierEffects extends MinaBaseEffect<DswFrontierActions> {

  readonly getLogs$: Effect;

  constructor(private actions$: Actions,
              private dswFrontierService: DswFrontierService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    //TODO: add to loading bar
    this.getLogs$ = createEffect(() => this.actions$.pipe(
      ofType(DSW_FRONTIER_GET_LOGS, DSW_FRONTIER_CLOSE),
      this.latestActionState<DswFrontierGetLogs | DswFrontierClose>(),
      switchMap(({ action, state }) =>
        action.type === DSW_FRONTIER_CLOSE
          ? EMPTY
          : this.dswFrontierService.getDswFrontierLogs(),
      ),
      map((payload: DswFrontierLog[]) => ({ type: DSW_FRONTIER_GET_LOGS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, DSW_FRONTIER_GET_LOGS_SUCCESS, []),
    ));
  }
}
