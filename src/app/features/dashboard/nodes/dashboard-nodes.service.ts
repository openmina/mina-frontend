import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { TracingBlocksService } from '@tracing/tracing-blocks/tracing-blocks.service';
import { ConfigService } from '@core/services/config.service';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { lastItem } from '@shared/helpers/array.helper';
import { getURL } from '@shared/constants/config';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';

@Injectable({
  providedIn: 'root',
})
export class DashboardNodesService {

  readonly API = 'http://116.202.128.230:8000';

  constructor(private http: HttpClient,
              private config: ConfigService) { }

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
            name: node.node.replace('http://1.k8.openmina.com:31308', ''),
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
          },
        ),
      );
  }

  getNodes(nodes: MinaNode[]): Observable<DashboardNode[]> {
    return forkJoin(
      nodes.map((node: MinaNode, index: number) => {
        const fullUrl = node.backend + '/graphql';
        return this.http.post(
          fullUrl,
          { query: syncQuery },
          { headers: { 'Content-Type': 'application/json' } },
        ).pipe(
          switchMap((response: any) => {
            const bestChain: any[] = response.data.bestChain;
            const blockHash = bestChain[bestChain.length - 1].stateHash;
            return this.http.post(
              fullUrl,
              { query: `query blockStructuredTrace { blockStructuredTrace(block_identifier: "${blockHash}") }` },
              { headers: { 'Content-Type': 'application/json' } },
            ).pipe(map((blockStructuredTrace: any) => {
              return ({
                daemon: response.data.daemonStatus,
                metrics: response.data.daemonStatus.metrics,
                blockStructuredTrace: blockStructuredTrace.data.blockStructuredTrace,
                blockHash,
              });
            }));
          }),
          map(({ daemon, metrics, blockStructuredTrace, blockHash }: { daemon: any, metrics: any, blockStructuredTrace: any, blockHash: string }) => {
            return {
              index,
              url: fullUrl,
              name: fullUrl.replace('http://1.k8.openmina.com:31308', ''),
              status: daemon.syncStatus,
              blockchainLength: daemon.blockchainLength,
              addr: daemon.addrsAndPorts.externalIp + ':' + daemon.addrsAndPorts.clientPort,
              date: toReadableDate(blockStructuredTrace.sections[0].checkpoints[0].started_at * ONE_THOUSAND),
              timestamp: blockStructuredTrace.sections[0].checkpoints[0].started_at * ONE_THOUSAND,
              blockApplication: lastItem(blockStructuredTrace.sections[0].checkpoints).started_at - blockStructuredTrace.sections[0].checkpoints[0].started_at,
              txPool: metrics.transactionPoolSize,
              addedTx: metrics.transactionsAddedToPool || 0,
              broadcastedTx: metrics.transactionPoolDiffBroadcasted || 0,
              receivedTx: metrics.transactionPoolDiffReceived || 0,
              snarkPool: metrics.snarkPoolSize,
              snarkDiffReceived: metrics.snarkPoolDiffReceived || 0,
              snarkDiffBroadcasted: metrics.snarkPoolDiffBroadcasted || 0,
              pendingSnarkWork: metrics.pendingSnarkWork || 0,
              latency: 0,
              source: blockStructuredTrace.source,
              hash: blockHash,
            } as DashboardNode;
          }),
          catchError(() => {
            const dash = '-';
            return of({
              index,
              url: fullUrl,
              name: fullUrl.replace('http://1.k8.openmina.com:31308', ''),
              status: AppNodeStatusTypes.OFFLINE,
              blockchainLength: undefined,
              addr: dash,
              date: dash,
              timestamp: undefined,
              blockApplication: undefined,
              latency: undefined,
              txPool: undefined,
              snarkPool: undefined,
              source: dash,
            } as DashboardNode);
          }),
        );
      }),
    );
  }
}


const nodes = ['node01', 'node02', 'node03', 'node04', 'node05', 'node06', 'node07', 'node08', 'node09', 'node10', 'node11', 'node12', 'node13', 'node14', 'node15', 'node16', 'node17', 'node18', 'node19', 'node20', 'node21', 'node22', 'node23', 'node24', 'node25', 'node26', 'node27', 'node28', 'node29', 'node30', 'node31', 'node32', 'node33', 'node34', 'node35', 'node36', 'node37', 'node38', 'node39', 'node40', 'node41', 'node42', 'node43', 'node44', 'node45', 'node46', 'node47', 'node48', 'node49', 'node50', 'node51', 'node52', 'node53', 'node54', 'node55', 'node56', 'node57', 'node58', 'node59', 'node60', 'node61', 'node62', 'node63', 'node64', 'node65', 'node66', 'node67', 'node68', 'node69', 'node70', 'node71', 'node72', 'node73', 'node74', 'node75', 'node76', 'node77', 'node78', 'node79', 'node80', 'node81', 'node82', 'node83', 'node84', 'node85', 'node86', 'node87', 'node88', 'node89', 'node90', 'node91', 'node92', 'node93', 'node94', 'node95', 'node96', 'node97', 'node98', 'node99', 'node100', 'node101', 'node102', 'node103', 'node104', 'node105', 'node106', 'node107', 'node108', 'node109', 'node110', 'node111', 'node112', 'node113', 'node114', 'node115', 'node116', 'node117', 'node118', 'node119', 'node120', 'node121', 'node122', 'node123', 'node124', 'node125', 'node126', 'node127', 'node128', 'node129', 'node130'];
const prods = ['prod1', 'prod2', 'prod3', 'prod4', 'prod5', 'prod6', 'prod7', 'prod8', 'prod9', 'prod10'];
const snarkers = ['snarker1', 'snarker2', 'snarker3', 'snarker4', 'snarker5', 'snarker6', 'snarker7', 'snarker8', 'snarker9', 'snarker10'];
const seeds = ['seed1', 'seed2', 'seed3', 'seed4', 'seed5'];
const transactionGenerator = ['transaction-generator'];

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
    bestChain(maxLength: 1) {
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
