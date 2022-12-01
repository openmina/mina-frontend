export interface NetworkBlock {
  messageKind: string;
  producerId: string;
  hash: string;
  date: string;
  sender: string;
  receiver: string;
  receivedMessageId: number;
  sentMessageId: number;
  height: number;
  globalSlot: number;
  incoming: 'Incoming' | 'Outgoing';
  sentLatency: number;
  receivedLatency: number;
  debuggerUrl: string;
  nodeAddr: string;
}
