import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/services/config.service';
import { map, Observable } from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_MILLION, ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { DashboardMessage } from '@shared/types/dashboard/dashboard-message';

@Injectable({
  providedIn: 'root',
})
export class AggregatorService {

  constructor(private http: HttpClient,
              private config: ConfigService) { }

  getDashboardMessages(height: number): Observable<{ messages: DashboardMessage[], nodeCount: number }> {
    return this.http.get<any>(this.config.AGGREGATOR + '/block/' + height).pipe(
      map((messages: any) => this.mapMessages(messages)),
    );
  }

  getEarliestBlockHeight(): Observable<number> {
    return this.http.get<any>(this.config.AGGREGATOR + '/block/latest').pipe(
      map((blocks: any) => blocks[0]),
    );
  }

  private mapMessages(response: any): { messages: DashboardMessage[], nodeCount: number } {
    if (!response) {
      return { messages: [], nodeCount: 0 };
    }
    const messages: DashboardMessage[] = [];
    response[1].forEach((block: any) => {
      const events = block.events.map((m: any) => {
        return {
          producerId: m.producer_id,
          date: m.receiving_time_microseconds
            ? toReadableDate(m.receiving_time_microseconds / ONE_THOUSAND)
            : undefined,
          timestamp: m.receiving_time_microseconds || -1,
          sourceAddr: m.source_addr,
          destAddr: m.destination_addr,
          nodeAddr: m.node_addr,
          hash: m.hash,
          height: m.block_height,
          globalSlot: m.global_slot,
          sentMessageId: m.sent_message_id,
          receivedMessageId: m.received_message_id,
          debuggerName: m.debugger_name,
          rebroadcastLatency: m.sending_time_microseconds && m.receiving_time_microseconds
            ? (m.sending_time_microseconds - m.receiving_time_microseconds) / ONE_MILLION
            : undefined,
          blockLatency: 0,
        } as DashboardMessage;
      });
      messages.push(...events);
    });

    const nodeCount = response[1]
      ? new Set(response[1].reduce((acc: any, curr: any) => [...acc, ...curr.events.map((m: any) => m.node_id)], [])).size
      : 0;
    return {
      messages,
      nodeCount,
    };
  }
}
