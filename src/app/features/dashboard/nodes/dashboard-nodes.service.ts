import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { catchError, concatAll, EMPTY, filter, finalize, from, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { TracingBlocksService } from '@tracing/tracing-blocks/tracing-blocks.service';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { lastItem } from '@shared/helpers/array.helper';
import { isNotVanilla } from '@shared/constants/config';
import { LoadingService } from '@core/services/loading.service';

const dash = '-';

@Injectable({
  providedIn: 'root',
})
export class DashboardNodesService {

  // readonly API = 'http://116.202.128.230:8000'; // aggregator
  readonly options = { headers: { 'Content-Type': 'application/json' } };

  constructor(private http: HttpClient,
              private loadingService: LoadingService) { }

  getLatestHeight(nodes: DashboardNode[]): Observable<number> {
    return from(
      nodes.map(node =>
        this.http
          .post(node.url, { query: latestBlockHeight }, this.options)
          .pipe(
            map((response: any) => Number(lastItem(response.data.bestChain).protocolState.consensusState.blockchainLength)),
            catchError(() => EMPTY),
          ),
      ),
    ).pipe(
      concatAll(),
      filter(Boolean),
      take(1),
    );
  }

  getNode(node: DashboardNode, height: number): Observable<DashboardNode[]> {
    if (isNotVanilla()) {
      const body = { query: syncQuery };
      return this.http.post(node.url, body, this.options).pipe(
        switchMap((syncResponse: any) =>
          this.http.post(node.tracingUrl, { query: tracingQuery(height) }, this.options).pipe(
            map((tracingResponse: any) => ({ syncResponse, tracingResponse })),
            catchError(() => {
              const error: any = new Error();
              error.data = syncResponse;
              return throwError(() => error);
            }),
          ),
        ),
        map(({ syncResponse, tracingResponse }: { syncResponse: any, tracingResponse: any }) => {
          const daemon = syncResponse.data.daemonStatus;
          const metrics = syncResponse.data.daemonStatus.metrics;
          const blockTraces = tracingResponse.data.blockTraces.traces;
          return blockTraces.map((trace: any) => ({
            ...node,
            status: daemon.syncStatus,
            blockchainLength: trace.blockchain_length,
            hash: trace.state_hash,
            addr: daemon.addrsAndPorts.externalIp + ':' + daemon.addrsAndPorts.clientPort,
            date: toReadableDate(trace.started_at * ONE_THOUSAND),
            timestamp: trace.started_at * ONE_THOUSAND,
            blockApplication: trace.total_time,
            txPool: metrics.transactionPoolSize || 0,
            addedTx: metrics.transactionsAddedToPool || 0,
            broadcastedTx: metrics.transactionPoolDiffBroadcasted || 0,
            receivedTx: metrics.transactionPoolDiffReceived || 0,
            snarkPool: metrics.snarkPoolSize || 0,
            snarkDiffReceived: metrics.snarkPoolDiffReceived || 0,
            snarkDiffBroadcasted: metrics.snarkPoolDiffBroadcasted || 0,
            pendingSnarkWork: metrics.pendingSnarkWork || 0,
            latency: 0,
            source: trace.source,
            loaded: true,
            traceStatus: trace.status,
          } as DashboardNode));
        }),
        catchError((error) => this.buildNodeFromErrorResponse(error, node)),
        finalize(() => this.loadingService.removeURL()),
      );
    } else {
      return this.http.post(node.url, { query: syncQueryVanilla }, this.options).pipe(
        map((response: any) => ({
          daemon: response.data.daemonStatus,
          metrics: response.data.daemonStatus.metrics,
          bestChain: response.data.bestChain.filter((c: any) => Number(c.protocolState.consensusState.blockHeight) === height),
        })),
        map(({ daemon, metrics, bestChain }: { daemon: any, metrics: any, bestChain: any[] }) => {
          return bestChain.map(chain => ({
            ...node,
            status: daemon.syncStatus,
            blockchainLength: chain.protocolState.consensusState.blockHeight,
            addr: daemon.addrsAndPorts.externalIp + ':' + daemon.addrsAndPorts.clientPort,
            date: dash,
            timestamp: 0,
            blockApplication: null,
            txPool: metrics.transactionPoolSize || 0,
            addedTx: metrics.transactionsAddedToPool || 0,
            broadcastedTx: metrics.transactionPoolDiffBroadcasted || 0,
            receivedTx: metrics.transactionPoolDiffReceived || 0,
            snarkPool: metrics.snarkPoolSize || 0,
            snarkDiffReceived: metrics.snarkPoolDiffReceived || 0,
            snarkDiffBroadcasted: metrics.snarkPoolDiffBroadcasted || 0,
            pendingSnarkWork: metrics.pendingSnarkWork || 0,
            latency: 0,
            source: dash,
            hash: chain.stateHash,
            loaded: true,
            traceStatus: chain.status,
          } as DashboardNode));
        }),
        catchError((error) => this.buildNodeFromErrorResponse(error, node)),
        finalize(() => this.loadingService.removeURL()),
      );
    }
  }

  private buildNodeFromErrorResponse(error: { data?: any }, node: DashboardNode) {
    const daemon = error.data?.data.daemonStatus;
    const status = daemon?.syncStatus ?? AppNodeStatusTypes.OFFLINE;
    const addr = daemon ? (daemon.addrsAndPorts.externalIp + ':' + daemon.addrsAndPorts.clientPort) : undefined;
    const metrics = daemon?.metrics;
    return of([{
      ...node,
      status,
      addr,
      blockchainLength: undefined,
      date: undefined,
      timestamp: undefined,
      blockApplication: undefined,
      latency: null,
      source: undefined,
      loaded: true,
      hash: undefined,
      txPool: metrics?.transactionPoolSize ?? undefined,
      addedTx: metrics?.transactionsAddedToPool ?? undefined,
      broadcastedTx: metrics?.transactionPoolDiffBroadcasted ?? undefined,
      receivedTx: metrics?.transactionPoolDiffReceived ?? undefined,
      snarkPool: metrics?.snarkPoolSize ?? undefined,
      snarkDiffReceived: metrics?.snarkPoolDiffReceived ?? undefined,
      snarkDiffBroadcasted: metrics?.snarkPoolDiffBroadcasted ?? undefined,
      pendingSnarkWork: metrics?.pendingSnarkWork ?? undefined,
      traceStatus: undefined,
    } as DashboardNode]);
  }

  getBlockTraceGroups(node: DashboardNode): Observable<TracingTraceGroup[]> {
    return this.http.post(
      node.tracingUrl,
      { query: `query blockStructuredTrace { blockStructuredTrace(block_identifier: "${node.hash}") }` },
      { headers: { 'Content-Type': 'application/json' } },
    )
      .pipe(
        map((response: any) => {
          return response.data.blockStructuredTrace.sections.map((group: any) => ({
            title: group.title.split('_').join(' '),
            checkpoints: TracingBlocksService.getCheckpoints(group),
          }) as TracingTraceGroup);
        }),
      );
  }

  /*
    // ------ THIS USES AGGREGATOR APPROACH ------

    getLatestHeight(): Observable<number> {
      return this.http.get<number>(this.API + '/traces/latest/height');
    }

    getNodes2(height?: number | string): Observable<DashboardNode[]> {
      height = height || 'latest';
      return this.http.get<any[]>(this.API + '/traces/' + height)
        .pipe(map((response: any[]) =>
          response.map((node: any, index: number) => {
            return ({
              index,
              url: node.node,
              name: node.node.replace(origin, ''),
              hash: node.block_hash,
              blockchainLength: node.height,
              date: node.date_time ? toReadableDate(node.date_time * ONE_THOUSAND) : undefined,
              timestamp: node.date_time ? node.date_time * ONE_THOUSAND : undefined,
              source: node.source,
              latency: node.receive_latency,
              status: node.sync_status,
              blockApplication: node.block_application,
              addr: node.node_address,
              txPool: node.transaction_pool_size,
              addedTx: node.metrics.transactionsAddedToPool || 0,
              broadcastedTx: node.metrics.transactionPoolDiffBroadcasted || 0,
              receivedTx: node.metrics.transactionPoolDiffReceived || 0,
              snarkPool: node.snark_pool_size,
              snarkDiffReceived: node.metrics.snarkPoolDiffReceived || 0,
              snarkDiffBroadcasted: node.metrics.snarkPoolDiffBroadcasted || 0,
              pendingSnarkWork: node.metrics.pendingSnarkWork || 0,
            });
          }),
        ));
    }*/
}

const syncQuery = `
  query status {
    daemonStatus {
      blockchainLength
      addrsAndPorts {
        bindIp
        clientPort
        externalIp
        libp2pPort
      }
      syncStatus
      metrics {
        transactionPoolSize
        transactionsAddedToPool
        transactionPoolDiffBroadcasted
        transactionPoolDiffReceived
        snarkPoolDiffBroadcasted
        snarkPoolDiffReceived
        snarkPoolSize
        pendingSnarkWork
      }
    }
  }
`;

const tracingQuery = (height: number) => `
  query traces { blockTraces(height: ${height}) }
`;

const syncQueryVanilla = `
  query status {
    daemonStatus {
      blockchainLength
      addrsAndPorts {
        bindIp
        clientPort
        externalIp
        libp2pPort
      }
      syncStatus
      metrics {
        transactionPoolSize
        transactionsAddedToPool
      }
    }
    bestChain(maxLength: 999999) {
      stateHash
      protocolState {
        consensusState {
          blockHeight
          blockchainLength
        }
      }
    }
  }
`;

const latestBlockHeight = `
  query latestBlockHeight {
    bestChain(maxLength: 1) {
      protocolState {
        consensusState {
          blockchainLength
        }
      }
    }
  }
`;
