import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { DswLiveBlockEvent } from '@shared/types/dsw/live/dsw-live-block-event.type';

export interface DswLiveNode extends DswDashboardNode {
  index: number;
  events: DswLiveBlockEvent[];
}