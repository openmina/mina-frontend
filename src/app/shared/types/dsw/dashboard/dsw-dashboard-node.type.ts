import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { DswDashboardNodeDetail } from '@shared/types/dsw/dashboard/dsw-dashboard-node-detail.type';

export interface DswDashboardNode {
  status: AppNodeStatusTypes;
  name: string;
  bestTip: string;
  fork: string;
  blocksApplied: number;
  blocksAppliedMax: number;
  missingBlocks: number;
  missingBlocksMax: number;
  downloadingBlocks: number;
  downloadingBlocksMax: number;
  details: DswDashboardNodeDetail;
}
