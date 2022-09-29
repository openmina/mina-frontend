import { TracingOverviewCheckpointColumn } from '@shared/types/tracing/overview/tracing-overview-checkpoint-column.type';

export interface TracingOverviewCheckpoint {
  title: string;
  totalTime: number;
  totalCount: number;
  columns: TracingOverviewCheckpointColumn[];
}
