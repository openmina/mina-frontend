import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { filter, map, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { WebNodeService } from '@web-node/web-node.service';
import {
  WEB_NODE_SHARED_GET_LOGS,
  WEB_NODE_SHARED_GET_LOGS_SUCCESS,
  WEB_NODE_SHARED_GET_PEERS,
  WEB_NODE_SHARED_GET_PEERS_SUCCESS,
  WEB_NODE_SHARED_INIT,
  WEB_NODE_SHARED_MARK_AS_OPENED,
  WebNodeSharedActions,
  WebNodeSharedInit,
} from '@web-node/web-node.actions';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { WebNodePeersService } from '@web-node/web-node-peers/web-node-peers.service';

@Injectable({
  providedIn: 'root',
})
export class WebNodeEffects extends MinaBaseEffect<WebNodeSharedActions> {

  readonly init$: Effect;
  readonly markAsOpened$: Effect;
  readonly getPeers$: Effect;
  readonly getLogs$: Effect;

  private networkDestroy$: Subject<void> = new Subject<void>();

  constructor(private actions$: Actions,
              private webNodeService: WebNodeService,
              private webNodePeersService: WebNodePeersService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(WEB_NODE_SHARED_INIT),
      this.latestActionState<WebNodeSharedInit>(),
      filter(({ state }) => !state.webNode.shared.isOpen),
      switchMap(({ action, state }) =>
        timer(0, 10000).pipe(
          takeUntil(this.networkDestroy$),
          switchMap(() => [
            { type: WEB_NODE_SHARED_GET_PEERS },
            { type: WEB_NODE_SHARED_GET_LOGS },
          ]),
        ),
      ),
    ));

    this.markAsOpened$ = createEffect(() => this.actions$.pipe(
      ofType(WEB_NODE_SHARED_INIT),
      this.latestActionState<WebNodeSharedInit>(),
      filter(({ state }) => !state.webNode.shared.isOpen),
      map(() => ({ type: WEB_NODE_SHARED_MARK_AS_OPENED })),
    ));

    this.getPeers$ = createEffect(() => this.actions$.pipe(
      ofType(WEB_NODE_SHARED_GET_PEERS),
      switchMap(() => this.webNodePeersService.getPeers()),
      map((payload: WebNodeLog[]) => ({ type: WEB_NODE_SHARED_GET_PEERS_SUCCESS, payload })),
    ));

    this.getLogs$ = createEffect(() => this.actions$.pipe(
      ofType(WEB_NODE_SHARED_GET_LOGS),
      switchMap(() => this.webNodeService.logs$),
      map((payload: WebNodeLog[]) => ({ type: WEB_NODE_SHARED_GET_LOGS_SUCCESS, payload })),
    ));
  }
}
