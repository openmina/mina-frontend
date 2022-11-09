import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import * as fromErrorPreview from '@app/layout/error-preview/error-preview.reducer';
import * as fromNetwork from '@network/network.reducer';
import * as fromApp from '@app/app.reducer';
import * as fromTracing from '@tracing/tracing.reducer';
import * as fromWebNode from '@web-node/web-node.reducer';

import { AppState } from '@app/app.state';
import { ErrorPreviewState } from '@error-preview/error-preview.state';
import { TracingState } from '@tracing/tracing.state';
import { WebNodeState } from '@web-node/web-node.state';
import { NetworkState } from '@network/network.state';
import { AppAction } from '@app/app.actions';
import { ErrorPreviewAction } from '@error-preview/error-preview.actions';
import { NetworkAction } from '@network/network.reducer';
import { TracingAction } from '@tracing/tracing.reducer';
import { WebNodeAction } from '@web-node/web-node.reducer';

export interface MinaState {
  app: AppState;
  error: ErrorPreviewState;
  network: NetworkState;
  tracing: TracingState;
  webNode: WebNodeState;
}

type MinaAction = AppAction
  & ErrorPreviewAction
  & NetworkAction
  & TracingAction
  & WebNodeAction
  ;

export const reducers: ActionReducerMap<MinaState, MinaAction> = {
  app: fromApp.reducer,
  error: fromErrorPreview.reducer,
  network: fromNetwork.reducer,
  tracing: fromTracing.reducer,
  webNode: fromWebNode.reducer,
};

export const metaReducers: MetaReducer<MinaState, MinaAction>[] = [];

export const selectMinaState = (state: MinaState): MinaState => state;
