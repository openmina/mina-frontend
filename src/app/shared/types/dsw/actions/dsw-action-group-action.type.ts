import { DswActionColumn } from '@shared/types/dsw/actions/dsw-action-column.type';

export interface DswActionGroupAction {
  display: boolean;
  title: string;
  fullTitle: string;
  totalTime: number;
  meanTime: number;
  totalCount: number;
  columns: DswActionColumn[];
}
