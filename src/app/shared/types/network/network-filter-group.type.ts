import { NetworkFilter } from '@shared/types/network/network-filter.type';

export interface NetworkFilterCategory {
  name: string;
  filters: NetworkFilter[];
  tooltip: string;
}
