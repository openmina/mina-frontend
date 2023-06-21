import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/services/config.service';
import { map, Observable } from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';
import { NetworkBlockIpc } from '@shared/types/network/blocks-ipc/network-block-ipc.type';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';

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
      map((blocks: any) => {
        if (!blocks) {
          throw new Error('No blocks found!');
        }
        return blocks[0].events[0].msg.height
      }),
    );
  }

  private mapBlocks(blocks: any): NetworkBlockIpc[] {
    if (!blocks) {
      return [];
    }

    return blocks.map((block: any) => {
      return {
        date: toReadableDate(block.time_microseconds / ONE_THOUSAND),
        timestamp: block.time_microseconds,
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
