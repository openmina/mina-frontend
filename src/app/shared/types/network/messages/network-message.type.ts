export interface NetworkMessage {
  id: number;
  connectionId: number;
  address: string;
  size: number;
  incoming: 'Incoming' | 'Outgoing';
  timestamp: string;
  exactTime: string;
  streamKind: string;
  messageKind: string;
  failedToDecryptPercentage?: number;
}
