import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, filter, forkJoin, map, of, switchMap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import {
  EXPLORER_BLOCKS_CLOSE,
  EXPLORER_BLOCKS_GET_BLOCKS,
  EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS, EXPLORER_BLOCKS_GET_TXS,
  EXPLORER_BLOCKS_GET_TXS_SUCCESS,
  EXPLORER_BLOCKS_SET_ACTIVE_BLOCK,
  ExplorerBlocksActions,
  ExplorerBlocksClose,
  ExplorerBlocksGetBlocks, ExplorerBlocksGetTxs,
  ExplorerBlocksSetActiveBlock,
} from '@explorer/blocks/explorer-blocks.actions';
import { ExplorerBlocksService } from '@explorer/blocks/explorer-blocks.service';
import { ExplorerBlockTx } from '@shared/types/explorer/blocks/explorer-block-tx.type';
import { ExplorerBlockZkApp } from '@shared/types/explorer/blocks/explorer-block-zk-app-type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerBlocksEffects extends MinaBaseEffect<ExplorerBlocksActions> {

  readonly getBlocks$: Effect;
  readonly setActiveBlock$: Effect;
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
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS, []),
    ));

    this.getTxs$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_BLOCKS_SET_ACTIVE_BLOCK),
      this.latestActionState<ExplorerBlocksSetActiveBlock>(),
      filter(({ action }) => !!action.payload),
      map(() => ({ type: EXPLORER_BLOCKS_GET_TXS })),
    ));

    this.getTxs$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_BLOCKS_GET_TXS, EXPLORER_BLOCKS_CLOSE),
      this.latestActionState<ExplorerBlocksGetTxs | ExplorerBlocksClose>(),
      switchMap(({ action, state }) => {
        const activeBlock = state.explorer.blocks.activeBlock;
        return action.type === EXPLORER_BLOCKS_CLOSE
          ? EMPTY
          : forkJoin([
            activeBlock.txCount > 0 ? this.blocksService.getTxs(activeBlock.height) : of([]),
            activeBlock.zkAppsCount > 0 ? this.blocksService.getZkApps(activeBlock.height) : of([]),
          ]);
      }),
      map((payload: [ExplorerBlockTx[], ExplorerBlockZkApp[]]) => ({ type: EXPLORER_BLOCKS_GET_TXS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, EXPLORER_BLOCKS_GET_TXS_SUCCESS, [[], []]),
    ));
  }
}
