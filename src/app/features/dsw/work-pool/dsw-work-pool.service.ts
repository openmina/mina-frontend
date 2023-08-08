import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { HttpClient } from '@angular/common/http';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_BILLION, ONE_MILLION, ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { WorkPoolSpecs } from '@shared/types/dsw/work-pool/work-pool-specs.type';
import { WorkPoolDetail } from '@shared/types/dsw/work-pool/work-pool-detail.type';
import { WorkPoolCommitment } from '@shared/types/dsw/work-pool/work-pool-commitment.type';
import { RustNodeService } from '@core/services/rust-node.service';

@Injectable({
  providedIn: 'root',
})
export class DswWorkPoolService {

  private snarkerHash: string;

  constructor(private http: HttpClient,
              private rust: RustNodeService) { }

  getWorkPool(): Observable<WorkPool[]> {
    return this.http.get<any[]>(this.rust.URL + '/snark-pool/jobs').pipe(
      switchMap((response: any[]) => {
        if (this.snarkerHash) {
          return of(response);
        }
        return this.http.get<any[]>(this.rust.URL + '/snarker/config').pipe(
          tap((config: any) => this.snarkerHash = config.public_key),
          map(() => response),
        )
      }),
      map((response: any[]) => this.mapWorkPoolResponse(response)),
    );
  }

  getWorkPoolDetail(id: string): Observable<WorkPoolDetail> {
    return this.http.get<WorkPoolDetail>(this.rust.URL + '/snark-pool/job/' + id);
  }

  getWorkPoolSpecs(id: string): Observable<WorkPoolSpecs> {
    return this.http.get<WorkPoolSpecs>(this.rust.URL + '/snarker/job/spec?id=' + id);
  }

  private mapWorkPoolResponse(response: any[]): WorkPool[] {
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
        work.commitmentOrigin = [commitment.commitment.snarker, commitment.sender].includes(this.snarkerHash) ? 'Local' : 'Remote';
      }
      if (item.snark) {
        work.snarkRecLatency = (item.snark.received_t - item.time) / ONE_BILLION;
        work.snarkOrigin = [item.snark.prover, item.snark.snarker].includes(this.snarkerHash) ? 'Local' : 'Remote';
      }
      work.notSameCommitter = commitment && item.snark && commitment.commitment.snarker !== item.snark.prover;
      return work;
    });
  }
}
