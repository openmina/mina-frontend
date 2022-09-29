import { NetworkFilterTypes } from '@shared/types/network/network-filter-types.enum';

export interface NetworkFilter {
  type: NetworkFilterTypes;
  display: string;
  value: string | number;
  tooltip?: string;
}
