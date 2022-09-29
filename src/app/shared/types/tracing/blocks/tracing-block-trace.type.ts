export interface TracingBlockTrace {
  id: number;
  source: string;
  globalSlot: number;
  hash: string;
  status: 'Pending' | 'Failure' | 'Success';
}
