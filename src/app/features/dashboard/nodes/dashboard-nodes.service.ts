import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import {
  catchError,
  concatAll,
  EMPTY,
  filter,
  finalize,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  scan,
  switchMap,
  take,
  throwError,
  toArray,
} from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { TracingBlocksService } from '@tracing/tracing-blocks/tracing-blocks.service';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { lastItem } from '@shared/helpers/array.helper';
import { CONFIG, isNotVanilla } from '@shared/constants/config';
import { LoadingService } from '@core/services/loading.service';
import { DashboardFork } from '@shared/types/dashboard/node-list/dashboard-fork.type';

const dash = '-';

@Injectable({
  providedIn: 'root',
})
export class DashboardNodesService {

  // readonly API = 'http://116.202.128.230:8000'; // aggregator
  private readonly options = { headers: { 'Content-Type': 'application/json' } };

  constructor(private http: HttpClient,
              private loadingService: LoadingService) { }

  getLatestHeight(nodes: DashboardNode[]): Observable<number> {
    return from(
      nodes.map(node =>
        this.http
          .post(node.url, { query: latestBlockHeight }, this.options)
          .pipe(
            map((response: any) => Number(lastItem(response.data.bestChain).protocolState.consensusState.slotSinceGenesis)),
            catchError(() => EMPTY),
          ),
      ),
    ).pipe(
      concatAll(),
      filter(Boolean),
      take(1),
    );
  }

  splitNodes(nodes: DashboardNode[]): Observable<DashboardNode[]> {
    const nodeName = (node: DashboardNode) => node.name.slice(1).replace('/graphql', '');
    const lastChar = (str: string) => str[str.length - 1];
    const leftList = nodes.filter(n => n.status === AppNodeStatusTypes.SYNCED).filter(node => Number(lastChar(nodeName(node))) % 2 === 0);
    const rightList = nodes.filter(n => n.status === AppNodeStatusTypes.SYNCED).filter(node => Number(lastChar(nodeName(node))) % 2 !== 0);

    const leftObs = from(
      leftList.map(node =>
        this.http
          .post<any>(CONFIG.configs.find(c => c.name === nodeName(node)).debugger + '/firewall/whitelist/enable', {
            'ips': leftList.map(n => n.addr.split(':')[0]),
            'ports': [10909, 10001],
          }, this.options)
          .pipe(
            catchError(() => EMPTY),
          ),
      ),
    ).pipe(
      concatAll(),
      toArray(),
    );
    const rightObs = from(
      rightList.map(node =>
        this.http
          .post<any>(CONFIG.configs.find(c => c.name === nodeName(node)).debugger + '/firewall/whitelist/enable', {
            'ips': rightList.map(n => n.addr.split(':')[0]),
            'ports': [10909, 10001],
          }, this.options)
          .pipe(
            catchError(() => EMPTY),
          ),
      ),
    ).pipe(
      concatAll(),
      toArray(),
    );

    return forkJoin([leftObs, rightObs]).pipe(
      map(([leftResult, rightResult]) => [...leftResult, ...rightResult]),
    );
  }

  getForks(nodes: DashboardNode[]): Observable<DashboardFork[]> {
    const uniqueNodes = Array.from(new Set(nodes.map(node => node.name)))
      .map(name => nodes.find(node => node.name === name))
      .filter(n => n.status === AppNodeStatusTypes.SYNCED);

    return from(
      uniqueNodes.map(node =>
        this.http
          .post<{ data: BestChainResponse }>(node.url, { query: bestChain() }, this.options)
          .pipe(
            map(({ data }: { data: BestChainResponse }) => ({
              chains: data.bestChain.filter(c => Number(c.protocolState.consensusState.blockHeight) <= node.blockchainLength),
              node,
            })),
            scan((acc, { chains, node }) => ({ chains, node }), { chains: [], node }),
            switchMap(({ chains, node }: { chains: BestChain[], node: DashboardNode }) => {
              return from([20, 30, 40]).pipe(
                mergeMap(depth => this.getDeepForks(chains, node, depth)),
              );
            }),
            catchError(() => EMPTY),
          ),
      ),
    ).pipe(
      concatAll(),
      toArray(),
      map((pairs: { chains: BestChain[], node: DashboardNode }[]) => {
        const branches: { name: string, candidates: string[] }[] = [];
        const candidates: string[] = [];
        const checkedPairs: { chains: BestChain[], node: DashboardNode }[] = [];
        const response: DashboardFork[] = [];
        pairs.forEach(({ chains, node }: { chains: BestChain[], node: DashboardNode }) => {
          const newItem: any = { bestTip: undefined, branch: undefined, name: node.name };
          const candidate = lastItem(chains)?.stateHash;
          if (candidate) {
            if (!candidates.includes(candidate)) {
              candidates.push(candidate);
              newItem.bestTip = candidate;

              const relatedPairListOfChains = checkedPairs.find((checked: { chains: BestChain[], node: DashboardNode }) => {
                chains.some(c => checked.chains.map(ch => ch.stateHash).includes(c.stateHash));
              })?.chains;
              const relatedCandidate = relatedPairListOfChains ? lastItem(relatedPairListOfChains).stateHash : undefined;

              const foundBranch = branches.find(b => b.candidates.includes(relatedCandidate));
              if (foundBranch) {
                newItem.branch = foundBranch.name;
              } else {
                const name = 'Branch ' + (branches.length + 1);
                branches.push({ name, candidates: [candidate] });
                newItem.branch = name;
              }
            } else {
              const branch = branches.find(b => b.candidates.includes(candidate));
              branch.candidates.push(candidate);
              newItem.bestTip = candidate;
              newItem.branch = branch.name;
            }
            checkedPairs.push({ chains, node });
            response.push(newItem);
          }
        });
        return response;
      }),
    );
  }

  private getDeepForks(chains: BestChain[], node: DashboardNode, maxLength: number): Observable<{ chains: BestChain[], node: DashboardNode }> {
    if (chains.length === 0) {
      return this.http
        .post<{ data: BestChainResponse }>(node.url, { query: bestChain(maxLength) }, this.options)
        .pipe(
          map(({ data }: { data: BestChainResponse }) => ({
            chains: data.bestChain.filter(c => Number(c.protocolState.consensusState.blockHeight) <= node.blockchainLength),
            node,
          })),
        );
    } else {
      return of({ chains, node });
    }
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
          let blockTraces = tracingResponse.data.blockTraces.traces.filter((t: any) => t.global_slot === height);
          blockTraces = blockTraces.length ? blockTraces : [{}];
          const map1 = blockTraces.map((trace: any) => ({
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
            branch: undefined,
            bestTip: undefined,
          } as DashboardNode));
          return map1;
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
            branch: undefined,
            bestTip: undefined,
          } as DashboardNode));
        }),
        catchError((error) => this.buildNodeFromErrorResponse(error, node)),
        finalize(() => this.loadingService.removeURL()),
      );
    }
  }

  private buildNodeFromErrorResponse(error: { data?: any }, node: DashboardNode): Observable<DashboardNode[]> {
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
      branch: undefined,
      bestTip: undefined,
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
  query traces { blockTraces(chainLength: ${height}) }
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
          slotSinceGenesis
        }
      }
    }
  }
`;


const bestChain = (maxLength: number = 10) => `
  query BestChain {
    bestChain(maxLength: ${maxLength}) {
      stateHash
      protocolState {
        consensusState {
          blockHeight
        }
        previousStateHash
      }
    }
  }
`;

interface BestChainResponse {
  bestChain: BestChain[];
}

interface BestChain {
  stateHash: string;
  protocolState: {
    consensusState: { blockHeight: number; };
    previousStateHash: string;
  };
}
