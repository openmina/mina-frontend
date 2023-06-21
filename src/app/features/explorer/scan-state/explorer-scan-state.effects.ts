import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaState, selectMinaState } from '@app/app.setup';
import { EMPTY, filter, map, switchMap, tap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  EXPLORER_SCAN_STATE_CLOSE,
  EXPLORER_SCAN_STATE_GET_SCAN_STATE,
  EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS,
  EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK,
  EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK,
  EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING,
  ExplorerScanStateActions,
  ExplorerScanStateClose,
  ExplorerScanStateGetScanState,
  ExplorerScanStateSetActiveBlock,
  ExplorerScanStateSetEarliestBlock,
  ExplorerScanStateToggleLeafsMarking,
} from '@explorer/scan-state/explorer-scan-state.actions';
import { ExplorerScanStateService } from '@explorer/scan-state/explorer-scan-state.service';
import { ExplorerScanStateTree } from '@shared/types/explorer/scan-state/explorer-scan-state-tree.type';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { ExplorerScanStateLeaf } from '@shared/types/explorer/scan-state/explorer-scan-state-leaf.type';
import { ExplorerSnark } from '@shared/types/explorer/snarks/explorer-snarks.type';
import { ExplorerScanStateResponse } from '@shared/types/explorer/scan-state/explorer-scan-state-response.type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerScanStateEffects extends MinaBaseEffect<ExplorerScanStateActions> {

  readonly getScanState$: Effect;
  readonly getEarliestBlock$: Effect;
  readonly setActiveBlock$: Effect;
  readonly toggleLeafsMarking$: Effect;

  constructor(private actions$: Actions,
              private router: Router,
              private scanStateService: ExplorerScanStateService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.getEarliestBlock$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK),
      this.latestActionState<ExplorerScanStateSetEarliestBlock>(),
      filter(({ state }) => !state.explorer.scanState.activeBlock),
      tap(({ action }) => this.router.navigate([Routes.EXPLORER, Routes.SCAN_STATE, action.payload.height], { queryParamsHandling: 'merge' })),
      map(({ action }) => ({ type: EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK, payload: { height: action.payload.height } })),
    ));

    this.setActiveBlock$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK),
      this.latestActionState<ExplorerScanStateSetActiveBlock>(),
      map(({ action }) => ({ type: EXPLORER_SCAN_STATE_GET_SCAN_STATE, payload: { height: action.payload.height } })),
    ));

    this.getScanState$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_SCAN_STATE_GET_SCAN_STATE, EXPLORER_SCAN_STATE_CLOSE),
      this.latestActionState<ExplorerScanStateGetScanState | ExplorerScanStateClose>(),
      switchMap(({ action, state }) =>
        action.type === EXPLORER_SCAN_STATE_CLOSE
          ? EMPTY
          : this.scanStateService.getScanState(action.payload.height)
            .pipe(
              map((response: ExplorerScanStateResponse) => ({ response, state })),
            ),
      ),
      map(({ response, state }: { response: ExplorerScanStateResponse, state: MinaState }) => {
        const scanState = this.addLeafMarkingToLeafs(state.explorer.snarks.snarks, response.scanState, state.explorer.scanState.leafsMarking);
        return ({ type: EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS, payload: { ...response, scanState } });
      }),
      catchErrorAndRepeat(MinaErrorType.GRAPH_QL, EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS, { scanState: null, txCount: 0, snarksCount: 0 }),
    ));

    this.toggleLeafsMarking$ = createEffect(() => this.actions$.pipe(
      ofType(EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING),
      this.latestActionState<ExplorerScanStateToggleLeafsMarking>(),
      map(({ state }) => {
        const scanState = this.addLeafMarkingToLeafs(state.explorer.snarks.snarks, state.explorer.scanState.scanState, state.explorer.scanState.leafsMarking);
        return ({ type: EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS, payload: { scanState } });
      }),
    ));
  }

  private addLeafMarkingToLeafs(snarks: ExplorerSnark[], trees: ExplorerScanStateTree[], leafsMarking: boolean): ExplorerScanStateTree[] {
    const workIds = snarks.reduce((acc: string[], s: ExplorerSnark) => [...acc, ...s.workIds.split(',')], []).map(s => Number(s));
    return trees.map((tree: ExplorerScanStateTree) => ({
      ...tree,
      leafs: tree.leafs.map(leaf => {
        if (leaf[4] === 'Done') {
          return leaf;
        }
        const newLeaf: ExplorerScanStateLeaf = [...leaf];
        if (leaf[2] && (workIds.includes(leaf[2][0]) || workIds.includes(leaf[2][1]))) {
          newLeaf[5] = leafsMarking;
        } else {
          newLeaf[5] = false;
        }
        return newLeaf;
      }),
    }));
  }
}
