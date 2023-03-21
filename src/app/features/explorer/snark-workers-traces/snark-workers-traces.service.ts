import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/services/config.service';
import { hasValue } from '@shared/helpers/values.helper';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import { SnarkWorkerTraceFilter } from '@shared/types/explorer/snark-traces/snark-worker-trace-filters.type';
import { removeLast } from '@shared/helpers/array.helper';

@Injectable({
  providedIn: 'root',
})
export class SnarkWorkersTracesService {

  constructor(private http: HttpClient,
              private config: ConfigService) { }

  getWorkers(): Observable<string[]> {
    return this.http.get<string[]>(removeLast(this.config.GQL.split('/')).join('/') + '/snarker-http-coordinator/workers');
  }

  getTraces(filter: SnarkWorkerTraceFilter): Observable<SnarkWorkerTraceJob[]> {
    let filters = Object.entries(filter).filter(e => hasValue(e[1]));
    const build: string[] = [];
    filters.forEach((f) => {
      build.push(f[0] === 'workers' && f[1].length ? `workers=${f[1].join(',')}` : null);
      build.push(f[0] === 'from' ? `from_t=${f[1]}` : null);
      build.push(f[0] === 'to' ? `to_t=${f[1]}` : null);
    });
    const queryParams = filters.length ? '?' + build.filter(Boolean).join('&') : '';
    return this.http.get(removeLast(this.config.GQL.split('/')).join('/') + '/snarker-http-coordinator/worker-stats' + queryParams).pipe(
      map(response => this.mapTraces(response)),
    );
  }

  private mapTraces(response: any): SnarkWorkerTraceJob[] {
    const workers: string[] = Object.keys(response);
    return workers.reduce((acc: SnarkWorkerTraceJob[], key: string, i: number) =>
        [
          ...acc,
          ...response[key].map((work: any, i2: number) => ({
            worker: i,
            kind: work.kind,
            ids: work.ids,
            id: acc.length + i2,
            jobInit: work.job_get_init_t,
            jobGetNodeReceived: work.job_get_node_received_t,
            jobGetNodeRequestWorkInit: work.job_get_node_request_work_init_t,
            jobGetNodeRequestWorkSuccess: work.job_get_node_request_work_success_t,
            jobGetSuccess: work.job_get_success_t,
            jobReceived: (work.job_get_success_t && work.job_get_init_t) ? (work.job_get_success_t - work.job_get_init_t) / ONE_THOUSAND : undefined,
            proofGenerated: (work.work_create_success_t && work.job_get_success_t) ? (work.work_create_success_t - work.job_get_success_t) / ONE_THOUSAND : undefined,
            workCreateSuccess: work.work_create_success_t,
            workSubmitNodeReceived: work.work_submit_node_received_t,
            workSubmitNodeAddWorkInit: work.work_submit_node_add_work_init_t,
            workSubmitNodeAddWorkSuccess: work.work_submit_node_add_work_success_t,
            workSubmitSuccess: work.work_submit_success_t,
            proofSubmitted: (work.work_submit_success_t && work.work_create_success_t) ? (work.work_submit_success_t - work.work_create_success_t) / ONE_THOUSAND : undefined,
          })),
        ],
      []);
  }
}
