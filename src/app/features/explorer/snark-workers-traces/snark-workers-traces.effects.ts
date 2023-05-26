import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { catchError, EMPTY, map, repeat, switchMap } from 'rxjs';
import { addError } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  SW_TRACES_CLOSE,
  SW_TRACES_GET_WORKERS_SUCCESS,
  SW_TRACES_INIT,
  SWTracesActions,
  SWTracesClose,
  SWTracesInit,
} from '@explorer/snark-workers-traces/snark-workers-traces.actions';
import { SnarkWorkersTracesService } from '@explorer/snark-workers-traces/snark-workers-traces.service';

@Injectable({
  providedIn: 'root',
})
export class SnarkWorkersTracesEffects extends MinaBaseEffect<SWTracesActions> {

  readonly getWorkers$: Effect;

  constructor(private actions$: Actions,
              private snarksService: SnarkWorkersTracesService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getWorkers$ = createEffect(() => this.actions$.pipe(
      ofType(SW_TRACES_INIT, SW_TRACES_CLOSE),
      this.latestActionState<SWTracesInit | SWTracesClose>(),
      switchMap(({ action }) =>
        action.type === SW_TRACES_CLOSE
          ? EMPTY
          : this.snarksService.getWorkers(),
      ),
      map((payload: string[]) => ({ type: SW_TRACES_GET_WORKERS_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: SW_TRACES_GET_WORKERS_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));
  }
}
