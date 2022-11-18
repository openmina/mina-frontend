import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { catchError, filter, map, of, repeat, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { addErrorObservable, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  NETWORK_BLOCKS_CLOSE,
  NETWORK_BLOCKS_GET_BLOCKS,
  NETWORK_BLOCKS_GET_BLOCKS_SUCCESS,
  NETWORK_BLOCKS_GET_EARLIEST_BLOCK,
  NETWORK_BLOCKS_INIT,
  NETWORK_BLOCKS_SET_ACTIVE_BLOCK,
  NETWORK_BLOCKS_SET_EARLIEST_BLOCK,
  NetworkBlocksActions,
  NetworkBlocksGetBlocks,
  NetworkBlocksGetEarliestBlock,
  NetworkBlocksInit,
  NetworkBlocksSetActiveBlock,
} from '@network/blocks/network-blocks.actions';
import { NetworkBlocksService } from '@network/blocks/network-blocks.service';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { Store } from '@ngrx/store';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NetworkBlocksEffects extends MinaBaseEffect<NetworkBlocksActions> {

  readonly init$: Effect;
  readonly earliestBlock$: Effect;
  readonly getBlocks$: Effect;
  readonly setActiveBlock$: Effect;
  readonly close$: NonDispatchableEffect;

  private networkDestroy$: Subject<void> = new Subject<void>();
  private streamActive: boolean;
  private waitingForServer: boolean;

  constructor(private router: Router,
              private actions$: Actions,
              private networkBlocksService: NetworkBlocksService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.earliestBlock$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_GET_EARLIEST_BLOCK),
      this.latestActionState<NetworkBlocksGetEarliestBlock>(),
      switchMap(({ action, state }) => {
        const block$ = action.payload.status !== AppNodeStatusTypes.SYNCED
          ? this.networkBlocksService.getEarliestBlockHeight()
          : of(action.payload.blockLevel);

        return block$.pipe(
          tap(height => this.router.navigate([Routes.NETWORK, Routes.BLOCKS, height])),
          switchMap(height => {
            const actions = [];
            actions.push({ type: NETWORK_BLOCKS_SET_EARLIEST_BLOCK, payload: { height } });
            if (!state.network.blocks.activeBlock) {
              actions.push({ type: NETWORK_BLOCKS_SET_ACTIVE_BLOCK, payload: { height } });
              actions.push({ type: NETWORK_BLOCKS_INIT });
            }
            return actions;
          }),
        );
      }),
    ));

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_INIT),
      this.latestActionState<NetworkBlocksInit>(),
      switchMap(() =>
        timer(0, 5000).pipe(
          takeUntil(this.networkDestroy$),
          filter(() => !this.waitingForServer),
          map(() => ({ type: NETWORK_BLOCKS_GET_BLOCKS })),
        ),
      ),
    ));

    this.getBlocks$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_GET_BLOCKS),
      this.latestActionState<NetworkBlocksGetBlocks>(),
      tap(({ state }) => this.streamActive = state.network.blocks.stream),
      tap(() => this.waitingForServer = true),
      switchMap(({ action, state }) => this.networkBlocksService.getBlockMessages(action.payload?.height || state.network.blocks.activeBlock)),
      tap(() => this.waitingForServer = false),
      map((payload: NetworkBlock[]) => ({ type: NETWORK_BLOCKS_GET_BLOCKS_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.DEBUGGER)),
      repeat(),
    ));

    this.setActiveBlock$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_SET_ACTIVE_BLOCK),
      this.latestActionState<NetworkBlocksSetActiveBlock>(),
      filter(({ action }) => action.payload.fetchNew),
      map(({ action }) => ({ type: NETWORK_BLOCKS_GET_BLOCKS, payload: { height: action.payload.height } })),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.networkDestroy$.next(null);
      }),
    ));
  }
}
