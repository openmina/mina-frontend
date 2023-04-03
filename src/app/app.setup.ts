import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import * as fromErrorPreview from '@error-preview/error-preview.reducer';
import { ErrorPreviewAction } from '@error-preview/error-preview.actions';
import { ErrorPreviewState } from '@error-preview/error-preview.state';

import * as fromNetwork from '@network/network.reducer';
import { NetworkAction } from '@network/network.reducer';
import { NetworkState } from '@network/network.state';

import * as fromApp from '@app/app.reducer';
import { AppAction } from '@app/app.actions';
import { AppState } from '@app/app.state';

import * as fromTracing from '@tracing/tracing.reducer';
import { TracingAction } from '@tracing/tracing.reducer';
import { TracingState } from '@tracing/tracing.state';

import * as fromWebNode from '@web-node/web-node.reducer';
import { WebNodeAction } from '@web-node/web-node.reducer';
import { WebNodeState } from '@web-node/web-node.state';

import * as fromBenchmarks from '@benchmarks/benchmarks.reducer';
import { BenchmarksAction } from '@benchmarks/benchmarks.actions';
import { BenchmarksState } from '@benchmarks/benchmarks.state';

import * as fromDashboard from '@dashboard/dashboard.reducer';
import { DashboardAction } from '@dashboard/dashboard.reducer';
import { DashboardState } from '@dashboard/dashboard.state';

import * as fromExplorer from '@explorer/explorer.reducer';
import { ExplorerAction } from '@explorer/explorer.reducer';
import { ExplorerState } from '@explorer/explorer.state';

import * as fromResources from '@resources/resources.reducer';
import { ResourcesAction } from '@resources/resources.reducer';
import { ResourcesState } from '@resources/resources.state';

import * as fromLogs from '@logs/logs.reducer';
import { LogsAction } from '@logs/logs.actions';
import { LogsState } from '@logs/logs.state';

import * as fromFuzzing from '@fuzzing/fuzzing.reducer';
import { FuzzingAction } from '@fuzzing/fuzzing.actions';
import { FuzzingState } from '@fuzzing/fuzzing.state';


export interface MinaState {
  app: AppState;
  error: ErrorPreviewState;
  network: NetworkState;
  tracing: TracingState;
  webNode: WebNodeState;
  benchmarks: BenchmarksState;
  dashboard: DashboardState;
  explorer: ExplorerState;
  resources: ResourcesState;
  logs: LogsState;
  fuzzing: FuzzingState;
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
  & ResourcesAction
  & LogsAction
  & FuzzingAction
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
  resources: fromResources.reducer,
  logs: fromLogs.reducer,
  fuzzing: fromFuzzing.reducer,
};

export const metaReducers: MetaReducer<MinaState, MinaAction>[] = [];

export const selectMinaState = (state: MinaState): MinaState => state;
