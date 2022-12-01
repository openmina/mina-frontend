import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_BILLION, ONE_MILLION, ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { ConfigService } from '@core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkBlocksService {

  constructor(private http: HttpClient,
              private config: ConfigService) { }

  getBlockMessages(height: number): Observable<NetworkBlock[]> {
    return this.http.get<any>(this.config.DEBUGGER + '/block/' + height).pipe(
      map((blocks: any) => this.mapBlocks(blocks)),
    );
  }

  getEarliestBlockHeight(): Observable<number> {
    return this.http.get<any>(this.config.DEBUGGER + '/block/latest').pipe(
      map((blocks: any) => blocks.height),
    );
  }

  private mapBlocks(blocks: any): NetworkBlock[] {
    return !blocks ? [] : blocks.events.map((block: any) => ({
      messageKind: block.message_kind,
      producerId: block.producer_id,
      hash: block.hash,
      date: toReadableDate((block.time.secs_since_epoch * ONE_THOUSAND) + block.time.nanos_since_epoch / ONE_MILLION),
      sender: block.sender_addr,
      receiver: block.receiver_addr,
      height: block.block_height,
      globalSlot: block.global_slot,
      receivedMessageId: block.received_message_id,
      sentMessageId: block.sent_message_id,
      debuggerUrl: block.debugger_url,
      nodeAddr: block.node_addr,
      incoming: block.incoming ? 'Incoming' : 'Outgoing',
      [block.incoming ? 'receivedLatency' : 'sentLatency']: !block.latency ? undefined : block.latency.secs + block.latency.nanos / ONE_BILLION,
    } as NetworkBlock));
  }
}
