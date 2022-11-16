import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CONFIG } from '@shared/constants/config';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_BILLION, ONE_MILLION, ONE_THOUSAND } from '@shared/constants/unit-measurements';

@Injectable({
  providedIn: 'root',
})
export class NetworkBlocksService {

  private readonly API: string = CONFIG.debugger;

  constructor(private http: HttpClient) { }

  getBlocks(): Observable<NetworkBlock[]> {
    return this.http.get<any[]>(this.API + '/block/latest').pipe(
      map((blocks: any) => {
        return blocks.events.map((block: any) => {
          return {
            messageKind: block.message_kind,
            producerId: block.producer_id,
            hash: block.hash,
            date: toReadableDate((block.time.secs_since_epoch * ONE_THOUSAND) + block.time.nanos_since_epoch / ONE_MILLION),
            sender: block.sender_addr,
            receiver: block.receiver_addr,
            height: block.block_height,
            globalSlot: block.global_slot,
            messageId: block.message_id,
            incoming: block.incoming ? 'Incoming' : 'Outgoing',
            [block.incoming ? 'receivedLatency' : 'sentLatency']: !block.latency ? undefined : block.latency.secs + block.latency.nanos / ONE_BILLION,
          } as NetworkBlock;
        });
      }),
    );
  }
}
