import { Injectable } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';
import { map, Observable } from 'rxjs';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class BlockService {

  constructor(private graphQL: GraphQLService,
              private http: HttpClient,
              private config: ConfigService) { }

  getNodeStatus(): Observable<NodeStatus> {
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
            blockLevel: Number(response.daemonStatus.blockchainLength ? response.daemonStatus.blockchainLength : 0),
            status: response.daemonStatus.syncStatus,
            timestamp: Number(response.daemonStatus ? response.daemonStatus.consensusTimeNow?.startTime : 0),
          } as NodeStatus);
        }),
      );
  }

  getDebuggerStatus(): Observable<boolean> {
    return this.http.get<string>(`${this.config.DEBUGGER}/version`).pipe(map(r => !!r));
  }
}
