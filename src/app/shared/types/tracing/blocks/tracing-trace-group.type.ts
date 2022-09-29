import { TracingTraceCheckpoint } from './tracing-trace-checkpoint.type';

export interface TracingTraceGroup {
  title: string;
  checkpoints: TracingTraceCheckpoint[];
}
