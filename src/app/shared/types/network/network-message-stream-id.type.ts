import { NetworkMessageStreamIdTypes } from '@shared/types/network/network-message-stream-id-types.enum';

export interface NetworkMessageStreamId {
  type: NetworkMessageStreamIdTypes;
  value: string;
}
