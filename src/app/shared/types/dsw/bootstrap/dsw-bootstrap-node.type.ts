import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';

export interface DswBootstrapNode extends DswDashboardNode {
  index: number;
  height: number;
  globalSlot: number;
  appliedBlocksAvg: number;
  appliedBlocksMin: number;
  appliedBlocksMax: number;
  fetchedBlocksAvg: number;
  fetchedBlocksMin: number;
  fetchedBlocksMax: number;
}