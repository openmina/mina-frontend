import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_MILLION, ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { AggregatorIpc } from '@shared/types/dashboard/aggregator-ipc/aggregator-ipc.type';

@Injectable({
  providedIn: 'root',
})
export class AggregatorIpcService {

  constructor(private http: HttpClient) { }

  getAggregatorMessages(height: number): Observable<{ messages: AggregatorIpc[], nodeCount: number }> {
    return this.http.get<any[]>('http://116.202.128.230:8000' + '/blocks/' + height).pipe(
      map((messages: any[]) => this.mapMessages(messages)),
    );
  }

  getEarliestBlockHeight(): Observable<number> {
    return this.http.get<any[]>('http://116.202.128.230:8000' + '/blocks/latest').pipe(
      map((blocks: any[]) => blocks[0]?.height),
    );
  }

  private mapMessages(response: any[]): { messages: AggregatorIpc[], nodeCount: number } {
    if (!response) {
      return { messages: [], nodeCount: 0 };
    }

    const messages: AggregatorIpc[] = [];

    response.forEach((block: any) => {
      const events = block.node_latencies.map((m: any) => ({
        height: block.height,
        hash: block.block_hash,
        messageSource: m.message_source,
        nodeAddress: m.node_address,
        date: toReadableDate(m.receive_time / ONE_THOUSAND),
        receiveTime: m.receive_time,
        latencySinceSent: m.latency_since_sent / ONE_MILLION,
      } as AggregatorIpc));
      messages.push(...events);
    });

    const nodeCount = new Set(response.reduce((acc: any, curr: any) => [...acc, ...curr.node_latencies.map((m: any) => m.node_address)], [])).size;
    return {
      messages,
      nodeCount,
    };
  }
}
