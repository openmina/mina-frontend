import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import * as fromErrorPreview from '@app/layout/error-preview/error-preview.reducer';
import * as fromNetwork from '@network/network.reducer';
import { NetworkAction } from '@network/network.reducer';
import * as fromApp from '@app/app.reducer';
import * as fromTracing from '@tracing/tracing.reducer';
import { TracingAction } from '@tracing/tracing.reducer';
import * as fromWebNode from '@web-node/web-node.reducer';
import { WebNodeAction } from '@web-node/web-node.reducer';
import * as fromBenchmarks from '@benchmarks/benchmarks.reducer';
import * as fromDashboard from '@dashboard/dashboard.reducer';
import * as fromExplorer from '@explorer/explorer.reducer';

import { AppState } from '@app/app.state';
import { ErrorPreviewState } from '@error-preview/error-preview.state';
import { TracingState } from '@tracing/tracing.state';
import { WebNodeState } from '@web-node/web-node.state';
import { NetworkState } from '@network/network.state';
import { AppAction } from '@app/app.actions';
import { ErrorPreviewAction } from '@error-preview/error-preview.actions';
import { BenchmarksState } from '@benchmarks/benchmarks.state';
import { BenchmarksAction } from '@benchmarks/benchmarks.actions';
import { DashboardState } from '@dashboard/dashboard.state';
import { DashboardAction } from '@dashboard/dashboard.reducer';
import { ExplorerState } from '@explorer/explorer.state';
import { ExplorerAction } from '@explorer/explorer.reducer';

export interface MinaState {
  app: AppState;
  error: ErrorPreviewState;
  network: NetworkState;
  tracing: TracingState;
  webNode: WebNodeState;
  benchmarks: BenchmarksState;
  dashboard: DashboardState;
  explorer: ExplorerState;
}

type MinaAction =
  & AppAction
  & ErrorPreviewAction
  & NetworkAction
  & TracingAction
  & WebNodeAction
  & BenchmarksAction
  & DashboardAction
  & ExplorerAction
  ;

export const reducers: ActionReducerMap<MinaState, MinaAction> = {
  app: fromApp.reducer,
  error: fromErrorPreview.reducer,
  network: fromNetwork.reducer,
  tracing: fromTracing.reducer,
  webNode: fromWebNode.reducer,
  benchmarks: fromBenchmarks.reducer,
  dashboard: fromDashboard.reducer,
  explorer: fromExplorer.reducer,
};

export const metaReducers: MetaReducer<MinaState, MinaAction>[] = [];

export const selectMinaState = (state: MinaState): MinaState => state;
