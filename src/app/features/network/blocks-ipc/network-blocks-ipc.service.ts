import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/services/config.service';
import { map, Observable } from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';
import { NetworkBlockIpc } from '@shared/types/network/blocks-ipc/network-block-ipc.type';
import { ONE_MILLION, ONE_THOUSAND } from '@shared/constants/unit-measurements';

@Injectable({
  providedIn: 'root',
})
export class NetworkBlocksIpcService {

  constructor(private http: HttpClient,
              private config: ConfigService) { }

  getBlockMessages(height: number): Observable<NetworkBlockIpc[]> {
    return this.http.get<any>(this.config.DEBUGGER + '/libp2p_ipc/block/' + height).pipe(
      map((blocks: any) => this.mapBlocks(blocks)),
    );
  }

  getEarliestBlockHeight(): Observable<number> {
    return this.http.get<any>(this.config.DEBUGGER + '/libp2p_ipc/block/latest').pipe(
      map((blocks: any) => blocks[0].events[0].msg.height),
    );
  }

  private mapBlocks(blocks: any): NetworkBlockIpc[] {
    if (!blocks) {
      return [];
    }
    //
    // const allTimestamps = blocks.events.map((block: any) => this.getTimestamp(block.time));
    // const fastestTime: bigint = allTimestamps.map((t: string) => BigInt(t)).reduce((t1: bigint, t2: bigint) => t2 < t1 ? t2 : t1);
    // return blocks.events.map((block: any, i: number) => ({
    //
    //   messageKind: block.message_kind,
    //   producerId: block.producer_id,
    //   hash: block.hash,
    //   date: toReadableDate((block.time.secs_since_epoch * ONE_THOUSAND) + block.time.nanos_since_epoch / ONE_MILLION),
    //   timestamp: allTimestamps[i],
    //   sender: block.sender_addr,
    //   receiver: block.receiver_addr,
    //   height: block.block_height,
    //   globalSlot: block.global_slot,
    //   messageId: block.message_id,
    //   incoming: block.incoming ? 'Incoming' : 'Outgoing',
    //   [block.incoming ? 'receivedLatency' : 'sentLatency']: Number(BigInt(allTimestamps[i]) - fastestTime) / ONE_BILLION,
    // } as NetworkBlockIpc));

    return blocks.map((block: any) => {
      return {
        date: toReadableDate(block.time_microseconds / ONE_THOUSAND),
        realDate: toReadableDate(block.real_time_microseconds / ONE_THOUSAND),
        timestamp: block.time_microseconds,
        realTimestamp: block.real_time_microseconds,
        dateDiff: (block.real_time_microseconds - block.time_microseconds) / ONE_MILLION,
        nodeAddress: block.node_address,
        peerAddress: block.events[0].peer_address,
        peerId: block.events[0].peer_id,
        type: block.events[0].type,
        hash: block.events[0].hash,
        msgType: block.events[0].msg.type,
        height: block.events[0].msg.height,
        blockLatency: 0,
        realBlockLatency: 0,
      } as NetworkBlockIpc;
    });

  }
}
