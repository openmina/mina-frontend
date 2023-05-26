import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { TracingBlockTraceStatus } from '@shared/types/tracing/blocks/tracing-block-trace.type';

export interface DashboardNode {
  index: number;
  url: string;
  tracingUrl: string;
  name: string;
  status: AppNodeStatusTypes;
  blockchainLength: number;
  addr: string;
  date: string;
  timestamp: number;
  blockApplication: number;
  latency: number;
  source: string;
  hash: string;
  txPool: number;
  addedTx: number;
  broadcastedTx: number;
  receivedTx: number;
  snarkPool: number;
  snarkDiffReceived: number;
  snarkDiffBroadcasted: number;
  pendingSnarkWork: number;
  loaded: boolean;
  traceStatus: TracingBlockTraceStatus;
  branch: string;
  bestTip: string;
}
