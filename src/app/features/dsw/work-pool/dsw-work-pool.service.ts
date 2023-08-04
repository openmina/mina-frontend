import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { HttpClient } from '@angular/common/http';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_BILLION, ONE_MILLION, ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { CONFIG } from '@shared/constants/config';
import { WorkPoolSpecs } from '@shared/types/dsw/work-pool/work-pool-specs.type';
import { WorkPoolDetail } from '@shared/types/dsw/work-pool/work-pool-detail.type';
import { WorkPoolCommitment } from '@shared/types/dsw/work-pool/work-pool-commitment.type';

@Injectable({
  providedIn: 'root',
})
export class DswWorkPoolService {

  constructor(private http: HttpClient) { }

  getWorkPool(): Observable<WorkPool[]> {
    return this.http.get<any[]>(CONFIG.rustNode + '/snark-pool/jobs').pipe(
      map((response: any[]) => this.mapWorkPoolResponse(response)),
    );
  }

  getWorkPoolDetail(id: string): Observable<WorkPoolDetail> {
    return this.http.get<WorkPoolDetail>(CONFIG.rustNode + '/snark-pool/job/' + id);
  }

  getWorkPoolSpecs(id: string): Observable<WorkPoolSpecs> {
    return this.http.get<WorkPoolSpecs>(CONFIG.rustNode + '/snarker/job/spec?id=' + id);
  }

  private mapWorkPoolResponse(response: any[]): WorkPool[] {
    const HASH = 'B62qqYvLLtTMQtHxRfuzZK21AJrqFE8Zq9Cyk3wtjegiTRn5soNQA9A';
    return response.map((item: any) => {
      const work = {
        id: item.id,
        datetime: toReadableDate(item.time / ONE_MILLION),
        timestamp: item.time,
        snark: item.snark,
      } as WorkPool;
      const commitment: WorkPoolCommitment = item.commitment;
      if (commitment) {
        work.commitment = {
          ...commitment,
          date: toReadableDate(commitment.commitment.timestamp),
        };
        work.commitmentRecLatency = (commitment.received_t - item.time) / ONE_BILLION;
        work.commitmentCreatedLatency = (commitment.commitment.timestamp / ONE_THOUSAND) - (item.time / ONE_BILLION);
        work.commitmentOrigin = [commitment.commitment.snarker, commitment.sender].includes(HASH) ? 'Local' : 'Remote';
      }
      if (item.snark) {
        work.snarkRecLatency = (item.snark.received_t - item.time) / ONE_BILLION;
        work.snarkOrigin = [item.snark.prover, item.snark.snarker].includes(HASH) ? 'Local' : 'Remote';
      }
      return work;
    });
  }
}
