export interface NetworkBlock {
  messageKind: string;
  producerId: string;
  hash: string;
  date: string;
  sender: string;
  receiver: string;
  messageId: number;
  height: number;
  globalSlot: number;
  incoming: 'Incoming' | 'Outgoing';
  sentLatency: number;
  receivedLatency: number;
}
