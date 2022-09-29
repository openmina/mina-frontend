import { Injectable } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';
import { map, Observable } from 'rxjs';
import { AppNodeStatus } from '@shared/types/app/app-node-status.type';

@Injectable({
  providedIn: 'root',
})
export class BlockService {

  constructor(private graphQL: GraphQLService) { }

  getNodeStatus(): Observable<{ lastBlockLevel: number, status: AppNodeStatus, timestamp: number }> {
    return this.graphQL.query<any>('blockStatus', `{
    daemonStatus {
      blockchainLength
      syncStatus
      consensusTimeNow {
        startTime
      }
    }}`)
      .pipe(
        map(response => {
          return ({
            lastBlockLevel: Number(response.daemonStatus.blockchainLength ? response.daemonStatus.blockchainLength : 0),
            status: response.daemonStatus.syncStatus,
            timestamp: Number(response.daemonStatus ? response.daemonStatus.consensusTimeNow.startTime : 0),
          });
        }),
      );
  }
}
