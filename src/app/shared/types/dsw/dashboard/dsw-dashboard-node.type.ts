import { DswDashboardBlock } from '@shared/types/dsw/dashboard/dsw-dashboard-block.type';
import { DswDashboardLedger } from '@shared/types/dsw/dashboard/dsw-dashboard-ledger.type';

export interface DswDashboardNode {
  name: string;
  kind: DswDashboardNodeKindType;
  bestTipReceived: string;
  bestTipReceivedTimestamp: number;
  bestTip: string;
  appliedBlocks: number;
  applyingBlocks: number;
  missingBlocks: number;
  fetchingBlocks: number;
  fetchedBlocks: number;
  ledgers: DswDashboardLedger;
  blocks: DswDashboardBlock[];
}

export enum DswDashboardNodeKindType {
  BOOTSTRAP = 'Bootstrap',
  CATCHUP = 'Catchup',
  SYNCED = 'Synced',
}
