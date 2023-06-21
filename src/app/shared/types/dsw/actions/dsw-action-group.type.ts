import { DswActionGroupAction } from '@shared/types/dsw/actions/dsw-action-group-action.type';

export interface DswActionGroup {
  groupName: string;
  count: number;
  totalTime: number;
  meanTime: number;
  actions: DswActionGroupAction[];
  display: boolean;
}
