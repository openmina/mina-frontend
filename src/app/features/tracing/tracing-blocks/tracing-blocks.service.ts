import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { toReadableDate } from '@shared/helpers/date.helper';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { TracingTraceCheckpoint } from '@shared/types/tracing/blocks/tracing-trace-checkpoint.type';
import { TracingGraphQlService } from '@core/services/tracing-graph-ql.service';

@Injectable({
  providedIn: 'root',
})
export class TracingBlocksService {

  constructor(private tracingGQL: TracingGraphQlService) { }

  getTraces(): Observable<TracingBlockTrace[]> {
    return this.tracingGQL.query<any>('getTraces', `{ blockTraces }`)
      .pipe(
        map((response: any) =>
          response.blockTraces.traces.reverse().map((trace: any) => ({
            height: Number(trace.blockchain_length),
            source: trace.source,
            hash: trace.state_hash,
            status: trace.status,
            totalTime: trace.total_time,
            globalSlot: trace.global_slot,
            creator: trace.metadata?.creator,
            metadata: trace.metadata,
          } as TracingBlockTrace)),
        ));
  }

  getBlockTraceGroups(hash: string): Observable<TracingTraceGroup[]> {
    return this.tracingGQL.query<any>('blockStructuredTrace', `{ blockStructuredTrace(block_identifier: "${hash}") }`)
      .pipe(
        map((response: any) =>
          response.blockStructuredTrace.sections.map((group: any) => ({
            title: group.title.split('_').join(' '),
            checkpoints: TracingBlocksService.getCheckpoints(group),
          }) as TracingTraceGroup),
        ),
      );
  }

  static getCheckpoints(checkpointParent: any): TracingTraceCheckpoint[] {
    return checkpointParent.checkpoints.map((checkpoint: any) => ({
      title: checkpoint.checkpoint.split('_').join(' '),
      startedAt: toReadableDate(checkpoint.started_at * ONE_THOUSAND, 'HH:mm:ss.SSS'),
      duration: checkpoint.duration,
      metadata: Object.keys(checkpoint.metadata || {}).length === 0
        ? undefined
        : (typeof checkpoint.metadata === 'string' ? checkpoint.metadata : JSON.stringify(checkpoint.metadata)),
      checkpoints: this.getCheckpoints(checkpoint),
    }));
  }
}

