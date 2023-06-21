import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, map, switchMap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  EXPLORER_SNARKS_CLOSE,
  EXPLORER_SNARKS_GET_SNARKS,
  EXPLORER_SNARKS_GET_SNARKS_SUCCESS,
  ExplorerSnarksActions,
  ExplorerSnarksClose,
  ExplorerSnarksGetSnarks,
} from '@explorer/snarks/explorer-snarks.actions';
import { ExplorerSnarksService } from '@explorer/snarks/explorer-snarks.service';
import { ExplorerSnark } from '@shared/types/explorer/snarks/explorer-snarks.type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerSnarksEffects extends MinaBaseEffect<ExplorerSnarksActions> {

  readonly getSnarks$: Effect;

  constructor(private actions$: Actions,
              private snarksService: ExplorerSnarksService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.getSnarks$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_SNARKS_GET_SNARKS, EXPLORER_SNARKS_CLOSE),
      this.latestActionState<ExplorerSnarksGetSnarks | ExplorerSnarksClose>(),
      switchMap(({ action }) =>
        action.type === EXPLORER_SNARKS_CLOSE
          ? EMPTY
          : this.snarksService.getSnarks(),
      ),
      map((payload: ExplorerSnark[]) => ({ type: EXPLORER_SNARKS_GET_SNARKS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, EXPLORER_SNARKS_GET_SNARKS_SUCCESS, []),
    ));
  }
}
