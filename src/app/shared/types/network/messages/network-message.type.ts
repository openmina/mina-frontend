export interface NetworkMessage {
  id: number;
  connectionId: number;
  address: string;
  size: number;
  incoming: 'Incoming' | 'Outgoing';
  timestamp: string;
  exactTime: {
    secs: number;
    nanos: number;
  };
  streamKind: string;
  messageKind: string;
  failedToDecryptPercentage?: number;
}
