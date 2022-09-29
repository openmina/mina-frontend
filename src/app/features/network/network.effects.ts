import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/types/store/mina-base.effect';
import { NetworkService } from '@network/network.service';
import {
  NETWORK_CHANGE_TAB,
  NETWORK_CLOSE,
  NETWORK_GET_CONNECTION,
  NETWORK_GET_CONNECTION_SUCCESS,
  NETWORK_GET_FULL_MESSAGE,
  NETWORK_GET_FULL_MESSAGE_SUCCESS,
  NETWORK_GET_MESSAGE_HEX,
  NETWORK_GET_MESSAGE_HEX_SUCCESS,
  NETWORK_GET_MESSAGES,
  NETWORK_GET_MESSAGES_SUCCESS,
  NETWORK_GET_PAGINATED_MESSAGES,
  NETWORK_GET_SPECIFIC_MESSAGE,
  NETWORK_GO_LIVE,
  NETWORK_INIT,
  NETWORK_PAUSE,
  NETWORK_SET_ACTIVE_ROW, NETWORK_SET_TIMESTAMP_INTERVAL,
  NETWORK_TOGGLE_FILTER,
  NetworkActions,
  NetworkChangeTab,
  NetworkGetConnection,
  NetworkGetFullMessage,
  NetworkGetMessageHex,
  NetworkGetMessages,
  NetworkGetPaginatedMessages,
  NetworkGetSpecificMessage,
  NetworkGoLive,
  NetworkInit,
  NetworkSetActiveRow,
} from '@network/network.actions';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { catchError, EMPTY, filter, forkJoin, map, mergeMap, of, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { NetworkMessage } from '@shared/types/network/network-message.type';
import { createNonDispatchableEffect } from '@shared/constants/store-functions';
import { NetworkConnection } from '@shared/types/network/network-connection.type';
import { ADD_ERROR } from '@app/layout/error-preview/error-preview.actions';
import { NetworkMessagesDirection } from '@shared/types/network/network-messages-direction.enum';

@Injectable({
  providedIn: 'root',
})
export class NetworkEffects extends MinaBaseEffect<NetworkActions> {

  readonly init$: Effect;
  readonly getMessages$: Effect;
  readonly getSpecificMessage$: Effect;
  readonly setActiveRow$: Effect;
  readonly getFullMessage$: Effect;
  readonly getConnection$: Effect;
  readonly getMessageHex$: Effect;
  readonly pause$: NonDispatchableEffect;
  readonly goLive$: NonDispatchableEffect;
  readonly close$: NonDispatchableEffect;

  private networkDestroy$: Subject<void> = new Subject<void>();
  private streamActive: boolean;

  constructor(private actions$: Actions,
              private networkService: NetworkService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_INIT),
      this.latestActionState<NetworkInit>(),
      tap(({ action, state }) => this.streamActive = state.network.stream),
      switchMap(({ action, state }) =>
        timer(0, 2000).pipe(
          takeUntil(this.networkDestroy$),
          filter(() => this.streamActive),
          map(() => ({ type: NETWORK_GET_MESSAGES })),
        ),
      ),
    ));

    this.getMessages$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_GET_MESSAGES, NETWORK_GET_PAGINATED_MESSAGES, NETWORK_TOGGLE_FILTER, NETWORK_SET_TIMESTAMP_INTERVAL),
      this.latestActionState<NetworkGetMessages | NetworkGetPaginatedMessages>(),
      tap(({ state }) => this.streamActive = state.network.stream),
      mergeMap(({ action, state }) =>
        this.networkService.getNetworkMessages(
          state.network.limit,
          (action as NetworkGetPaginatedMessages).payload?.id,
          state.network.direction,
          state.network.activeFilters,
          state.network.timestamp?.from,
          state.network.timestamp?.to,
        ),
      ),
      map((payload: NetworkMessage[]) => ({ type: NETWORK_GET_MESSAGES_SUCCESS, payload })),
      catchError((error: Error) => [
        { type: ADD_ERROR, payload: { title: 'Network messages', message: error.message, timestamp: Date.now() } },
      ]),
    ));

    this.getSpecificMessage$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_GET_SPECIFIC_MESSAGE),
      this.latestActionState<NetworkGetSpecificMessage>(),
      tap(({ state }) => this.streamActive = state.network.stream),
      switchMap(({ action, state }) =>
        forkJoin([
          this.networkService.getNetworkMessages(
            state.network.limit / 2,
            action.payload.id,
            NetworkMessagesDirection.REVERSE,
            state.network.activeFilters,
            state.network.timestamp?.from,
            state.network.timestamp?.to,
          ),
          this.networkService.getNetworkMessages(
            state.network.limit / 2 + 1,
            action.payload.id,
            NetworkMessagesDirection.FORWARD,
            state.network.activeFilters,
            state.network.timestamp?.from,
            state.network.timestamp?.to,
          ),
        ]).pipe(
          map((messages: [NetworkMessage[], NetworkMessage[]]) =>
            ({ messages: [...messages[0], ...messages[1].slice(1)], id: action.payload.id }),
          ),
        ),
      ),
      switchMap((response: { messages: NetworkMessage[], id: number }) => [
        { type: NETWORK_GET_MESSAGES_SUCCESS, payload: response.messages },
        { type: NETWORK_SET_ACTIVE_ROW, payload: response.messages.find(m => m.id === response.id) },
      ]),
      catchError((error: Error) => [
        { type: ADD_ERROR, payload: { title: 'Network messages', message: error.message, timestamp: Date.now() } },
      ]),
    ));

    this.setActiveRow$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_SET_ACTIVE_ROW, NETWORK_CHANGE_TAB),
      this.latestActionState<NetworkSetActiveRow | NetworkChangeTab>(),
      filter(({ state }) => !!state.network.activeRow),
      switchMap(({ state }) => {
        const activeTab = state.network.activeTab;
        return activeTab === 1
          ? state.network.activeRowFullMessage ? EMPTY : of({ type: NETWORK_GET_FULL_MESSAGE, payload: { id: state.network.activeRow.id } })
          : activeTab === 2
            ? state.network.activeRowHex ? EMPTY : of({ type: NETWORK_GET_MESSAGE_HEX, payload: { id: state.network.activeRow.id } })
            : state.network.connection ? EMPTY : of({ type: NETWORK_GET_CONNECTION, payload: { id: state.network.activeRow.connectionId } });
      }),
    ));

    this.getFullMessage$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_GET_FULL_MESSAGE),
      this.latestActionState<NetworkGetFullMessage>(),
      mergeMap(({ action }) => this.networkService.getNetworkFullMessage(action.payload.id)),
      map((payload: any) => ({ type: NETWORK_GET_FULL_MESSAGE_SUCCESS, payload })),
      catchError((err: Error) => of({ type: NETWORK_GET_FULL_MESSAGE_SUCCESS, payload: err.message })),
    ));

    this.getMessageHex$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_GET_MESSAGE_HEX),
      this.latestActionState<NetworkGetMessageHex>(),
      switchMap(({ action }) => this.networkService.getNetworkMessageHex(action.payload.id)),
      map((payload: string) => ({ type: NETWORK_GET_MESSAGE_HEX_SUCCESS, payload })),
    ));

    this.getConnection$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_GET_CONNECTION),
      this.latestActionState<NetworkGetConnection>(),
      switchMap(({ action }) => this.networkService.getNetworkConnection(action.payload.id)),
      map((payload: NetworkConnection) => ({ type: NETWORK_GET_CONNECTION_SUCCESS, payload })),
    ));

    this.pause$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_PAUSE, NETWORK_GET_PAGINATED_MESSAGES),
      tap(() => this.streamActive = false),
    ));

    this.goLive$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_GO_LIVE),
      this.latestActionState<NetworkGoLive>(),
      tap(() => this.streamActive = true),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_CLOSE),
      tap(() => {
        this.streamActive = false;
        this.networkDestroy$.next(null);
      }),
    ));
  }
}
