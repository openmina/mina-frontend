import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { catchError, concatAll, EMPTY, filter, finalize, from, map, Observable, of, take } from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { TracingBlocksService } from '@tracing/tracing-blocks/tracing-blocks.service';
import { ConfigService } from '@core/services/config.service';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { lastItem } from '@shared/helpers/array.helper';
import { isNotVanilla } from '@shared/constants/config';
import { LoadingService } from '@core/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardNodesService {

  // readonly API = 'http://116.202.128.230:8000'; // aggregator
  readonly options = { headers: { 'Content-Type': 'application/json' } };

  constructor(private http: HttpClient,
              private loadingService: LoadingService,
              private config: ConfigService) { }

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

  getLatestHeight(nodes: DashboardNode[]): Observable<number> {
    return from(
      nodes.map(node =>
        this.http
          .post(node.url, { query: latestBlockHeight }, this.options)
          .pipe(catchError(() => EMPTY)),
      ),
    ).pipe(
      concatAll(),
      filter(Boolean),
      take(1),
      map((response: any) => Number(lastItem(response.data.bestChain).protocolState.consensusState.blockchainLength)),
    );
  }

  getNode(node: DashboardNode, height: number): Observable<DashboardNode[]> {
    if (isNotVanilla()) {
      const body = { query: syncQuery(height) };
      return this.http.post(node.url, body, this.options).pipe(
        map((response: any) => {
          const daemon = response.data.daemonStatus;
          const metrics = response.data.daemonStatus.metrics;
          const blockTraces = response.data.blockTraces.traces;
          return blockTraces.map((trace: any) => ({
            ...node,
            status: daemon.syncStatus,
            blockchainLength: trace.blockchain_length_int,
            hash: trace.state_hash,
            addr: daemon.addrsAndPorts.externalIp + ':' + daemon.addrsAndPorts.clientPort,
            date: toReadableDate(trace.started_at * ONE_THOUSAND),
            timestamp: trace.started_at * ONE_THOUSAND,
            blockApplication: blockTraces[0].total_time,
            txPool: metrics.transactionPoolSize,
            addedTx: metrics.transactionsAddedToPool || 0,
            broadcastedTx: metrics.transactionPoolDiffBroadcasted || 0,
            receivedTx: metrics.transactionPoolDiffReceived || 0,
            snarkPool: metrics.snarkPoolSize,
            snarkDiffReceived: metrics.snarkPoolDiffReceived || 0,
            snarkDiffBroadcasted: metrics.snarkPoolDiffBroadcasted || 0,
            pendingSnarkWork: metrics.pendingSnarkWork || 0,
            latency: 0,
            source: trace.source,
            loaded: true,
            traceStatus: trace.status,
          } as DashboardNode));
        }),
        catchError(() => {
          const dash = '-';
          return of([{
            ...node,
            status: AppNodeStatusTypes.OFFLINE,
            blockchainLength: undefined,
            addr: dash,
            date: dash,
            timestamp: undefined,
            blockApplication: undefined,
            latency: null,
            txPool: undefined,
            snarkPool: undefined,
            source: dash,
            loaded: true,
          } as DashboardNode]);
        }),
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
            date: '-',
            timestamp: 0,
            blockApplication: null,
            txPool: metrics.transactionPoolSize,
            addedTx: metrics.transactionsAddedToPool || 0,
            broadcastedTx: metrics.transactionPoolDiffBroadcasted || 0,
            receivedTx: metrics.transactionPoolDiffReceived || 0,
            snarkPool: metrics.snarkPoolSize,
            snarkDiffReceived: metrics.snarkPoolDiffReceived || 0,
            snarkDiffBroadcasted: metrics.snarkPoolDiffBroadcasted || 0,
            pendingSnarkWork: metrics.pendingSnarkWork || 0,
            latency: 0,
            source: '-',
            hash: chain.stateHash,
            loaded: true,
            traceStatus: chain.status,
          } as DashboardNode));
        }),
        catchError(() => {
          const dash = '-';
          return of([{
            ...node,
            status: AppNodeStatusTypes.OFFLINE,
            blockchainLength: undefined,
            addr: dash,
            date: dash,
            timestamp: undefined,
            blockApplication: undefined,
            latency: null,
            txPool: undefined,
            snarkPool: undefined,
            source: dash,
            loaded: true,
          } as DashboardNode]);
        }),
        finalize(() => this.loadingService.removeURL()),
      );
    }
  }

  getBlockTraceGroups(node: DashboardNode): Observable<TracingTraceGroup[]> {
    return this.http.post(
      node.url,
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
}

const syncQuery = (height: number) => `
  query status {
    blockTraces(height: ${height}),
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
