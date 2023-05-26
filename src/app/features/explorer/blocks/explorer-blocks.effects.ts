import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { catchError, EMPTY, forkJoin, map, of, repeat, switchMap } from 'rxjs';
import { addError } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import {
  EXPLORER_BLOCKS_CLOSE,
  EXPLORER_BLOCKS_GET_BLOCKS,
  EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS,
  EXPLORER_BLOCKS_GET_TXS_SUCCESS,
  EXPLORER_BLOCKS_SET_ACTIVE_BLOCK,
  ExplorerBlocksActions,
  ExplorerBlocksClose,
  ExplorerBlocksGetBlocks,
  ExplorerBlocksSetActiveBlock,
} from '@explorer/blocks/explorer-blocks.actions';
import { ExplorerBlocksService } from '@explorer/blocks/explorer-blocks.service';
import { ExplorerBlockTx } from '@shared/types/explorer/blocks/explorer-block-tx.type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerBlocksEffects extends MinaBaseEffect<ExplorerBlocksActions> {

  readonly getBlocks$: Effect;
  readonly getTxs$: Effect;

  constructor(private actions$: Actions,
              private blocksService: ExplorerBlocksService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getBlocks$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_BLOCKS_GET_BLOCKS, EXPLORER_BLOCKS_CLOSE),
      this.latestActionState<ExplorerBlocksGetBlocks | ExplorerBlocksClose>(),
      switchMap(({ action }) =>
        action.type === EXPLORER_BLOCKS_CLOSE
          ? EMPTY
          : this.blocksService.getBlocks(),
      ),
      map((payload: ExplorerBlock[]) => ({ type: EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));

    this.getTxs$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_BLOCKS_SET_ACTIVE_BLOCK, EXPLORER_BLOCKS_CLOSE),
      this.latestActionState<ExplorerBlocksSetActiveBlock | ExplorerBlocksClose>(),
      switchMap(({ action }) =>
        action.type === EXPLORER_BLOCKS_CLOSE || !action.payload
          ? EMPTY
          : forkJoin([
            action.payload.txCount > 0 ? this.blocksService.getTxs(action.payload.height) : of([]),
            action.payload.zkAppsCount > 0 ? this.blocksService.getZkApps(action.payload.height) : of([]),
          ]),
      ),
      map((payload: [ExplorerBlockTx[], any[]]) => ({ type: EXPLORER_BLOCKS_GET_TXS_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: EXPLORER_BLOCKS_GET_TXS_SUCCESS, payload: [[], []] },
      ]),
      repeat(),
    ));
  }
}
