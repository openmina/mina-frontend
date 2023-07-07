import { DswDashboardNodeDetail } from '@shared/types/dsw/dashboard/dsw-dashboard-node-detail.type';
import { DswDashboardBlock } from '@shared/types/dsw/dashboard/dsw-dashboard-block.type';

export interface DswDashboardNode {
  name: string;
  status: DswDashboardNodeStatusType;
  bestTipReceived: string;
  bestTipReceivedTimestamp: number;
  bestTip: string;
  fork: string;
  blocksApplied: number;
  applyingBlocks: number;
  missingBlocks: number;
  downloadingBlocks: number;
  blocks: DswDashboardBlock[];
  details: DswDashboardNodeDetail;
}

export enum DswDashboardNodeStatusType {
  BOOTSTRAP = 'Bootstrap',
  CATCHUP = 'Catchup',
  SYNCED = 'Synced',
}
