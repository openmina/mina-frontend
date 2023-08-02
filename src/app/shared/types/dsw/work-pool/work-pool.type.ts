import { WorkPoolSnark } from '@shared/types/dsw/work-pool/work-pool-snark.type';

export interface WorkPool {
  datetime: string;
  timestamp: number;
  id: string;
  jobs: any[];
  commitment: any;
  snark: WorkPoolSnark;
  types: string[];
  typesSort: string;
}
