import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { filter, map, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { catchErrorAndRepeat, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  NETWORK_BLOCKS_IPC_CLOSE,
  NETWORK_BLOCKS_IPC_GET_BLOCKS,
  NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS,
  NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK,
  NETWORK_BLOCKS_IPC_INIT,
  NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK,
  NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK,
  NetworkBlocksIpcActions,
  NetworkBlocksIpcGetBlocks,
  NetworkBlocksIpcGetEarliestBlock,
  NetworkBlocksIpcSetActiveBlock,
} from '@network/blocks-ipc/network-blocks-ipc.actions';
import { Store } from '@ngrx/store';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import { NetworkBlocksIpcService } from '@network/blocks-ipc/network-blocks-ipc.service';
import { NetworkBlockIpc } from '@shared/types/network/blocks-ipc/network-block-ipc.type';
import { NetworkBlocksIpcState } from '@network/blocks-ipc/network-blocks-ipc.state';

@Injectable({
  providedIn: 'root',
})
export class NetworkBlocksIpcEffects extends MinaBaseEffect<NetworkBlocksIpcActions> {

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
              private networkBlocksService: NetworkBlocksIpcService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.earliestBlock$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK),
      this.latestStateSlice<NetworkBlocksIpcState, NetworkBlocksIpcGetEarliestBlock>('network.blocksIpc'),
      switchMap((state: NetworkBlocksIpcState) =>
        this.networkBlocksService.getEarliestBlockHeight().pipe(
          switchMap(height => {
            const actions: NetworkBlocksIpcActions[] = [{ type: NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK, payload: { height } }];
            if (!state.activeBlock) {
              this.router.navigate([Routes.NETWORK, Routes.BLOCKS_IPC, height ?? ''], { queryParamsHandling: 'merge' });
              actions.push({ type: NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK, payload: { height } });
              actions.push({ type: NETWORK_BLOCKS_IPC_INIT });
            }
            return actions;
          }),
        ),
      ),
      catchErrorAndRepeat(MinaErrorType.DEBUGGER, NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK, {}),
    ));

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_IPC_INIT),
      switchMap(() =>
        timer(0, 5000).pipe(
          takeUntil(this.networkDestroy$),
          filter(() => !this.waitingForServer),
          map(() => ({ type: NETWORK_BLOCKS_IPC_GET_BLOCKS })),
        ),
      ),
    ));

    this.getBlocks$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_IPC_GET_BLOCKS),
      this.latestActionState<NetworkBlocksIpcGetBlocks>(),
      tap(({ state }) => this.streamActive = state.network.blocksIpc.stream),
      tap(() => this.waitingForServer = true),
      switchMap(({ action, state }) => this.networkBlocksService.getBlockMessages(action.payload?.height || state.network.blocksIpc.activeBlock)),
      tap(() => this.waitingForServer = false),
      map((payload: NetworkBlockIpc[]) => ({ type: NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.DEBUGGER, NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS, []),
    ));

    this.setActiveBlock$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK),
      this.latestActionState<NetworkBlocksIpcSetActiveBlock>(),
      filter(({ action }) => action.payload.fetchNew),
      map(({ action }) => ({ type: NETWORK_BLOCKS_IPC_GET_BLOCKS, payload: { height: action.payload.height } })),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_IPC_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.networkDestroy$.next(null);
      }),
    ));
  }
}
