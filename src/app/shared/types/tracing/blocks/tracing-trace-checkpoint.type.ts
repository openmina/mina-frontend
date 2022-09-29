export interface TracingTraceCheckpoint {
  title: string;
  startedAt: string;
  duration: number;
  metadata: string;
  checkpoints: TracingTraceCheckpoint[];
}
