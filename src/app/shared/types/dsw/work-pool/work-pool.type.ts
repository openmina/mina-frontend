import { WorkPoolSnark } from '@shared/types/dsw/work-pool/work-pool-snark.type';

export interface WorkPool {
  datetime: string;
  timestamp: number;
  id: string;
  commitment: any;
  snark: WorkPoolSnark;
  snarkRecLatency: number;
  snarkOrigin: 'Local' | 'Remote';
  commitmentRecLatency: number;
  commitmentOrigin: 'Local' | 'Remote';
  commitmentCreatedLatency: number;
}
