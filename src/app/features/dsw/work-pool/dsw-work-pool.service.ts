import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { HttpClient } from '@angular/common/http';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_BILLION, ONE_MILLION } from '@shared/constants/unit-measurements';
import { CONFIG } from '@shared/constants/config';
import { WorkPoolSpecs } from '@shared/types/dsw/work-pool/work-pool-specs.type';

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
      if (item.commitment) {
        work.commitment = {
          ...item.commitment,
          date: toReadableDate(item.commitment.timestamp),
        };
        work.commitmentRecLatency = (item.commitment.received_t - item.time) / ONE_BILLION;
        work.commitmentOrigin = [item.commitment.commitment.snarker, item.commitment.sender].includes(HASH) ? 'Local' : 'Remote';
      }
      if (item.snark) {
        work.snarkRecLatency = (item.snark.received_t - item.time) / ONE_BILLION;
        work.snarkOrigin = [item.snark.prover, item.snark.snarker].includes(HASH) ? 'Local' : 'Remote';
      }
      return work;
    });
  }
}
