import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';

export interface NodeStatus {
  blockLevel: number;
  timestamp: number;
  status: AppNodeStatusTypes;
}
