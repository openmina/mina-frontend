export interface TracingBlockTrace {
  source: string;
  height: number;
  hash: string;
  status: TracingBlockTraceStatus;
  totalTime: number;
  globalSlot: number;
  creator: string;
  metadata: any | null;
}

export type TracingBlockTraceStatus = 'Pending' | 'Failure' | 'Success';
