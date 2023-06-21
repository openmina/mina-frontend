import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { catchError, filter, map, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { WebNodeService } from '@web-node/web-node.service';
import {
  WEB_NODE_SHARED_GET_LOGS,
  WEB_NODE_SHARED_GET_LOGS_SUCCESS,
  WEB_NODE_SHARED_GET_PEERS,
  WEB_NODE_SHARED_GET_PEERS_SUCCESS,
  WEB_NODE_SHARED_INIT,
  WEB_NODE_SHARED_MARK_AS_OPENED,
  WebNodeSharedActions, WebNodeSharedGetLogs, WebNodeSharedGetPeers,
  WebNodeSharedInit,
} from '@web-node/web-node.actions';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { WebNodePeersService } from '@web-node/web-node-peers/web-node-peers.service';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { Router } from '@angular/router';

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
              private router: Router,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(WEB_NODE_SHARED_INIT),
      this.latestActionState<WebNodeSharedInit>(),
      filter(({ state }) => !state.webNode.shared.isOpen),
      switchMap(({ action, state }) =>
        timer(0, 10000).pipe(
          takeUntil(this.networkDestroy$),
          switchMap(() => {
            const actions: Array<WebNodeSharedGetPeers | WebNodeSharedGetLogs> = [];

            if (this.router.url.includes('/peers')) {
              actions.push({ type: WEB_NODE_SHARED_GET_PEERS });
            } else if (this.router.url.includes('/logs')) {
              actions.push({ type: WEB_NODE_SHARED_GET_LOGS });
            }
            return actions;
          }),
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
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, WEB_NODE_SHARED_GET_PEERS_SUCCESS, []),
    ));

    this.getLogs$ = createEffect(() => this.actions$.pipe(
      ofType(WEB_NODE_SHARED_GET_LOGS),
      switchMap(() => this.webNodeService.logs$),
      map((payload: WebNodeLog[]) => ({ type: WEB_NODE_SHARED_GET_LOGS_SUCCESS, payload })),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, WEB_NODE_SHARED_GET_LOGS_SUCCESS, []),
    ));
  }
}
