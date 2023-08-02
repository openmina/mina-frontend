import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';
import { HttpClient } from '@angular/common/http';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_MILLION } from '@shared/constants/unit-measurements';

@Injectable({
  providedIn: 'root',
})
export class DswWorkPoolService {

  constructor(private http: HttpClient) { }

  getWorkPool(): Observable<WorkPool[]> {
    return this.http.get<any[]>('http://webrtc2.webnode.openmina.com:10000/snark-pool/jobs').pipe(
      map((response: any[]) => this.mapWorkPoolResponse(response)),
    );
  }

  private mapWorkPoolResponse(response: any[]): WorkPool[] {
    return response.map((item: any) => {
      let types: string[] = [];
      if (item.job[Object.keys(item.job)[0]]) {
        types.push('Jobs');
      }
      if (item.snark) {
        types.push('Snark');
      }
      if (item.commitment) {
        types.push('Commitment');
      }

      return {
        id: item.id,
        datetime: toReadableDate(item.time / ONE_MILLION),
        timestamp: item.time,
        jobs: item.job[Object.keys(item.job)[0]],
        snark: item.snark,
        commitment: item.commitment ? {
          ...item.commitment,
          date: toReadableDate(item.commitment.timestamp),
        } : item.commitment,
        types: types,
        typesSort: types.toString(),
      } as WorkPool;
    });
  }
}
