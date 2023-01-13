import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { catchError, map, repeat, switchMap } from 'rxjs';
import { addError } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import {
  EXPLORER_BLOCKS_GET_BLOCKS,
  EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS,
  ExplorerBlocksActions,
  ExplorerBlocksGetBlocks,
} from '@explorer/blocks/explorer-blocks.actions';
import { ExplorerBlocksService } from '@explorer/blocks/explorer-blocks.service';

@Injectable({
  providedIn: 'root',
})
export class ExplorerBlocksEffects extends MinaBaseEffect<ExplorerBlocksActions> {

  readonly getBlocks$: Effect;

  constructor(private actions$: Actions,
              private blocksService: ExplorerBlocksService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getBlocks$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_BLOCKS_GET_BLOCKS),
      this.latestActionState<ExplorerBlocksGetBlocks>(),
      switchMap(() => this.blocksService.getBlocks()),
      map((payload: ExplorerBlock[]) => ({ type: EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));
  }
}
