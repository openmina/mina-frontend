import { Injectable } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';
import { map, Observable } from 'rxjs';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { toReadableDate } from '@shared/helpers/date.helper';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';

@Injectable({
  providedIn: 'root',
})
export class TracingBlocksService {

  constructor(private graphQL: GraphQLService) { }

  getTraces(): Observable<TracingBlockTrace[]> {
    return this.graphQL.query<any>('getTraces', `{ blockTraces }`)
      .pipe(
        map((response: any) =>
          response.blockTraces.traces.reverse().map((trace: any, id: number) => ({
            globalSlot: Number(trace.global_slot ?? trace.blockchain_length ?? trace.height), //TODO: get only one property. Check backend response
            source: trace.source,
            hash: trace.state_hash,
            status: trace.status,
            id,
          } as TracingBlockTrace)),
        ));
  }

  getBlockTraceGroups(hash: string): Observable<TracingTraceGroup[]> {
    const getCheckpoints = (checkpointParent: any) => checkpointParent.checkpoints.map((checkpoint: any) => ({
      title: checkpoint.checkpoint.split('_').join(' '),
      startedAt: toReadableDate(checkpoint.started_at * 1000, 'HH:mm:ss.SSS'),
      duration: checkpoint.duration,
      metadata: checkpoint.metadata,
      checkpoints: getCheckpoints(checkpoint),
    }));

    return this.graphQL.query<any>('blockStructuredTrace', `{ blockStructuredTrace(block_identifier: "${hash}") }`)
      .pipe(
        map((response: any) =>
          response.blockStructuredTrace.sections.map((group: any) => ({
            title: group.title.split('_').join(' '),
            checkpoints: getCheckpoints(group),
          }) as TracingTraceGroup),
        ),
      );
  }
}

