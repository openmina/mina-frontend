export interface NetworkMessage {
  id: number;
  connectionId: number;
  address: string;
  size: number;
  incoming: 'Incoming' | 'Outgoing';
  timestamp: string;
  // streamId: NetworkMessageStreamId;
  streamKind: string;
  // streamType: NetworkMessageStreamType;
  messageKind: string;
}
