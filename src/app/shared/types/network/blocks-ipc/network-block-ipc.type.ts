export interface NetworkBlockIpc {
  date: string;
  realDate: string;
  dateDiff: number;
  timestamp: number;
  realTimestamp: number;
  nodeAddress: string;
  type: string;
  peerId: string;
  peerAddress: string;
  msgType: string;
  height: number;
  hash: string;
  blockLatency: number;
  realBlockLatency: number;
}
