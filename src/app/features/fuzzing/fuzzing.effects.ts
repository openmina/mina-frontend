import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { catchError, filter, map, repeat, switchMap } from 'rxjs';
import { addError } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  FUZZING_GET_FILE_DETAILS,
  FUZZING_GET_FILE_DETAILS_SUCCESS,
  FUZZING_GET_FILES,
  FUZZING_GET_FILES_SUCCESS,
  FuzzingActions,
  FuzzingGetFileDetails,
  FuzzingGetFiles,
} from '@fuzzing/fuzzing.actions';
import { FuzzingService } from '@fuzzing/fuzzing.service';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import { FuzzingFileDetails } from '@shared/types/fuzzing/fuzzing-file-details.type';

@Injectable({
  providedIn: 'root',
})
export class FuzzingEffects extends MinaBaseEffect<FuzzingActions> {

  readonly getFiles$: Effect;
  readonly getFileDetails$: Effect;

  constructor(private actions$: Actions,
              private fuzzingService: FuzzingService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getFiles$ = createEffect(() => this.actions$.pipe(
      ofType(FUZZING_GET_FILES),
      this.latestActionState<FuzzingGetFiles>(),
      switchMap(({ action }) => this.fuzzingService.getFiles(action.payload.urlType)),
      map((payload: FuzzingFile[]) => ({ type: FUZZING_GET_FILES_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: FUZZING_GET_FILES_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));

    this.getFileDetails$ = createEffect(() => this.actions$.pipe(
      ofType(FUZZING_GET_FILE_DETAILS),
      this.latestActionState<FuzzingGetFileDetails>(),
      filter(({ action }) => !!action.payload),
      switchMap(({ action }) => this.fuzzingService.getFileDetails(action.payload.name)),
      map((payload: FuzzingFileDetails) => ({ type: FUZZING_GET_FILE_DETAILS_SUCCESS, payload })),
    ));
  }
}
