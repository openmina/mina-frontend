import { ExplorerBlockZkAppFullData } from '@shared/types/explorer/blocks/explorer-block-zk-app-full-data.type';

export interface ExplorerBlockZkApp {
  id: string;
  hash: string;
  updates: number;
  failures: number;
  zkAppFullData: ExplorerBlockZkAppFullData;
}
