import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { map, mergeMap, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { createNonDispatchableEffect } from '@shared/constants/store-functions';
import { NETWORK_BLOCKS_CLOSE } from '@network/blocks/network-blocks.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  STRESSING_CLOSE,
  STRESSING_GET_TRANSACTIONS, STRESSING_GET_TRANSACTIONS_SUCCESS,
  STRESSING_GET_WALLETS,
  STRESSING_GET_WALLETS_SUCCESS, STRESSING_INIT,
  StressingActions, StressingGetTransactions,
  StressingGetWallets, StressingInit,
} from '@stressing/stressing.actions';
import { StressingService } from '@stressing/stressing.service';
import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';

@Injectable({
  providedIn: 'root',
})
export class StressingEffects extends MinaBaseEffect<StressingActions> {

  readonly init$: Effect;
  readonly getWallets$: Effect;
  readonly getTransactions$: Effect;
  readonly close$: NonDispatchableEffect;

  private destroy$: Subject<void> = new Subject<void>();
  private streamActive: boolean;

  constructor(private router: Router,
              private actions$: Actions,
              private stressingService: StressingService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_INIT),
      this.latestActionState<StressingInit>(),
      switchMap(() =>
        timer(0, 5000).pipe(
          takeUntil(this.destroy$),
          map(() => ({ type: STRESSING_GET_TRANSACTIONS })),
        ),
      ),
    ));

    this.getWallets$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_GET_WALLETS),
      this.latestActionState<StressingGetWallets>(),
      switchMap(() => this.stressingService.getWallets()),
      map((payload: any[]) => ({ type: STRESSING_GET_WALLETS_SUCCESS, payload })),
    ));

    this.getTransactions$ = createEffect(() => this.actions$.pipe(
      ofType(STRESSING_GET_TRANSACTIONS),
      this.latestActionState<StressingGetTransactions>(),
      mergeMap(() => this.stressingService.getTransactions()),
      map((payload: StressingTransaction[]) => ({ type: STRESSING_GET_TRANSACTIONS_SUCCESS, payload })),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(STRESSING_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.destroy$.next(null);
      }),
    ));
  }
}
