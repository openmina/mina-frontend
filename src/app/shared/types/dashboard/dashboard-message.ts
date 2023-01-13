export interface DashboardMessage {
  producerId: string;
  date: string;
  timestamp: number;
  sourceAddr: string;
  destAddr: string;
  nodeAddr: string;
  hash: string;
  height: number;
  globalSlot: number;
  sentMessageId: number;
  receivedMessageId: number;
  debuggerName: string;
  rebroadcastLatency: number;
  blockLatency: number;
}
