export interface TracingBlockTrace {
  id: number;
  source: string;
  height: number;
  hash: string;
  status: 'Pending' | 'Failure' | 'Success';
  totalTime: number;
}
