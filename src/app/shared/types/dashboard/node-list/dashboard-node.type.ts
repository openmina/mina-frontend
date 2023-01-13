import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';

export interface DashboardNode {
  index: number;
  url: string;
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
}
