import { WorkPoolSnark } from '@shared/types/dsw/work-pool/work-pool-snark.type';
import { WorkPoolCommitment } from '@shared/types/dsw/work-pool/work-pool-commitment.type';

export interface WorkPool {
  datetime: string;
  timestamp: number;
  id: string;
  commitment: WorkPoolCommitment;
  snark: WorkPoolSnark;
  snarkRecLatency: number;
  snarkOrigin: 'Local' | 'Remote';
  commitmentRecLatency: number;
  commitmentOrigin: 'Local' | 'Remote';
  commitmentCreatedLatency: number;
  notSameCommitter: boolean;
}
