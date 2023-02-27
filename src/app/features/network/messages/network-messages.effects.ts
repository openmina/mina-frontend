import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { NetworkMessagesService } from '@network/messages/network-messages.service';
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
  NETWORK_SET_ACTIVE_ROW,
  NETWORK_SET_TIMESTAMP_INTERVAL,
  NETWORK_TOGGLE_FILTER,
  NetworkMessagesActions,
  NetworkMessagesChangeTab,
  NetworkMessagesGetConnection,
  NetworkMessagesGetFullMessage,
  NetworkMessagesGetMessageHex,
  NetworkMessagesGetMessages,
  NetworkMessagesGetPaginatedMessages,
  NetworkMessagesGetSpecificMessage,
  NetworkMessagesGoLive,
  NetworkMessagesInit,
  NetworkMessagesSetActiveRow,
  NetworkMessagesSetTimestampInterval,
  NetworkMessagesToggleFilter,
} from '@network/messages/network-messages.actions';
import { Effect, NonDispatchableEffect } from '@shared/types/store/effect.type';
import { catchError, EMPTY, filter, forkJoin, map, mergeMap, of, repeat, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { NetworkMessage } from '@shared/types/network/messages/network-message.type';
import { addErrorObservable, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { NetworkMessageConnection } from '@shared/types/network/messages/network-messages-connection.type';
import { NetworkMessagesDirection } from '@shared/types/network/messages/network-messages-direction.enum';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';

@Injectable({
  providedIn: 'root',
})
export class NetworkMessagesEffects extends MinaBaseEffect<NetworkMessagesActions> {

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
  private waitingForServer: boolean;

  constructor(private actions$: Actions,
              private networkMessagesService: NetworkMessagesService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_INIT),
      this.latestActionState<NetworkMessagesInit>(),
      tap(({ action, state }) => {
        this.streamActive = state.network.messages.stream;
        this.networkDestroy$ = new Subject<void>();
      }),
      switchMap(({ action, state }) =>
        timer(0, 10000).pipe(
          takeUntil(this.networkDestroy$),
          filter(() => this.streamActive && !this.waitingForServer),
          map(() => ({ type: NETWORK_GET_MESSAGES })),
        ),
      ),
    ));

    this.getMessages$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_GET_MESSAGES, NETWORK_GO_LIVE, NETWORK_GET_PAGINATED_MESSAGES, NETWORK_TOGGLE_FILTER, NETWORK_SET_TIMESTAMP_INTERVAL),
      this.latestActionState<NetworkMessagesGetMessages | NetworkMessagesGoLive | NetworkMessagesGetPaginatedMessages | NetworkMessagesToggleFilter | NetworkMessagesSetTimestampInterval>(),
      tap(({ state }) => this.streamActive = state.network.messages.stream),
      tap(() => this.waitingForServer = true),
      switchMap(({ action, state }) =>
        this.networkMessagesService.getNetworkMessages(
          state.network.messages.limit,
          state.network.messages.direction,
          state.network.messages.activeFilters,
          state.network.messages.timestamp.from,
          state.network.messages.timestamp.to,
        ),
      ),
      tap(() => this.waitingForServer = false),
      map((payload: NetworkMessage[]) => ({ type: NETWORK_GET_MESSAGES_SUCCESS, payload })),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.DEBUGGER)),
      repeat(),
    ));

    this.getSpecificMessage$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_GET_SPECIFIC_MESSAGE),
      this.latestActionState<NetworkMessagesGetSpecificMessage>(),
      tap(({ state }) => this.streamActive = state.network.messages.stream),
      switchMap(({ action, state }) =>
        forkJoin([
          this.networkMessagesService.getNetworkMessages(
            state.network.messages.limit / 2,
            NetworkMessagesDirection.REVERSE,
            state.network.messages.activeFilters,
            undefined,
            state.network.messages.timestamp?.to,
          ),
          this.networkMessagesService.getNetworkMessages(
            state.network.messages.limit / 2 + 1,
            NetworkMessagesDirection.FORWARD,
            state.network.messages.activeFilters,
            undefined,
            state.network.messages.timestamp?.to,
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
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.DEBUGGER)),
      repeat(),
    ));

    this.setActiveRow$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_SET_ACTIVE_ROW, NETWORK_CHANGE_TAB),
      this.latestActionState<NetworkMessagesSetActiveRow | NetworkMessagesChangeTab>(),
      filter(({ state }) => !!state.network.messages.activeRow),
      switchMap(({ state }) => {
        const activeTab = state.network.messages.activeTab;
        return activeTab === 1
          ? state.network.messages.activeRowFullMessage ? EMPTY : of({ type: NETWORK_GET_FULL_MESSAGE, payload: { id: state.network.messages.activeRow.id } })
          : activeTab === 2
            ? state.network.messages.activeRowHex ? EMPTY : of({ type: NETWORK_GET_MESSAGE_HEX, payload: { id: state.network.messages.activeRow.id } })
            : state.network.messages.connection ? EMPTY : of({ type: NETWORK_GET_CONNECTION, payload: { id: state.network.messages.activeRow.connectionId } });
      }),
    ));

    this.getFullMessage$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_GET_FULL_MESSAGE),
      this.latestActionState<NetworkMessagesGetFullMessage>(),
      mergeMap(({ action }) => this.networkMessagesService.getNetworkFullMessage(action.payload.id)),
      map((payload: any) => ({ type: NETWORK_GET_FULL_MESSAGE_SUCCESS, payload })),
      catchError((err: Error) => of({ type: NETWORK_GET_FULL_MESSAGE_SUCCESS, payload: err.message })),
    ));

    this.getMessageHex$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_GET_MESSAGE_HEX),
      this.latestActionState<NetworkMessagesGetMessageHex>(),
      switchMap(({ action }) => this.networkMessagesService.getNetworkMessageHex(action.payload.id)),
      map((payload: string) => ({ type: NETWORK_GET_MESSAGE_HEX_SUCCESS, payload })),
    ));

    this.getConnection$ = createEffect(() => this.actions$.pipe(
      ofType(NETWORK_GET_CONNECTION),
      this.latestActionState<NetworkMessagesGetConnection>(),
      switchMap(({ action }) => this.networkMessagesService.getNetworkConnection(action.payload.id)),
      map((payload: NetworkMessageConnection) => ({ type: NETWORK_GET_CONNECTION_SUCCESS, payload })),
    ));

    this.pause$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_PAUSE, NETWORK_GET_PAGINATED_MESSAGES),
      tap(() => this.streamActive = false),
    ));

    this.goLive$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(NETWORK_GO_LIVE),
      this.latestActionState<NetworkMessagesGoLive>(),
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
