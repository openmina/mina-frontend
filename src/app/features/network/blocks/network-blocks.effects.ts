import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { catchError, map, repeat, Subject, switchMap, tap } from 'rxjs';
import { addErrorObservable, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  NETWORK_BLOCKS_CLOSE,
  NETWORK_BLOCKS_GET_BLOCKS,
  NETWORK_BLOCKS_GET_BLOCKS_SUCCESS,
  NetworkBlocksActions,
  NetworkBlocksGetBlocks,
} from '@network/blocks/network-blocks.actions';
import { NetworkBlocksService } from '@network/blocks/network-blocks.service';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class NetworkBlocksEffects extends MinaBaseEffect<NetworkBlocksActions> {

  readonly init$: Effect;
  readonly getBlocks$: Effect;
  readonly close$: NonDispatchableEffect;

  private networkDestroy$: Subject<void> = new Subject<void>();
  private streamActive: boolean;
  private waitingForServer: boolean;

  constructor(private actions$: Actions,
              private networkBlocksService: NetworkBlocksService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    // this.init$ = createEffect(() => this.actions$.pipe(
    //   ofType(NETWORK_BLOCKS_INIT),
    //   this.latestActionState<NetworkBlocksInit>(),
    //   tap(({ state }) => this.streamActive = state.network.blocks.stream),
    //   switchMap(() =>
    //     timer(0, 10000).pipe(
    //       takeUntil(this.networkDestroy$),
    //       filter(() => this.streamActive && !this.waitingForServer),
    //       map(() => ({ type: NETWORK_BLOCKS_GET_BLOCKS })),
    //     ),
    //   ),
    // ));

    this.getBlocks$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_BLOCKS_GET_BLOCKS),
      this.latestActionState<NetworkBlocksGetBlocks>(),
      tap(({ state }) => this.streamActive = state.network.blocks.stream),
      tap(() => this.waitingForServer = true),
      switchMap(({ action, state }) => this.networkBlocksService.getBlocks()),
      tap(() => this.waitingForServer = false),
      map((payload: NetworkBlock[]) => ({ type: NETWORK_BLOCKS_GET_BLOCKS_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.DEBUGGER)),
      repeat(),
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
