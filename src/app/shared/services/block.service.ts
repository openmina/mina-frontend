import { Injectable } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';
import { map, Observable, of } from 'rxjs';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/services/config.service';
import { CONFIG } from '@shared/constants/config';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';

const NO_NODE_STATUS: NodeStatus = {
  blockLevel: 0,
  status: null,
  timestamp: 0
};

@Injectable({
  providedIn: 'root',
})
export class BlockService {

  constructor(private graphQL: GraphQLService,
              private http: HttpClient,
              private config: ConfigService) { }

  getNodeStatus(): Observable<NodeStatus> {
    if (CONFIG.noServerStatus || CONFIG.rustNodes) {
      return of(NO_NODE_STATUS);
    }
    if (CONFIG.nodeLister) {
      return of({
        blockLevel: 1,
        status: AppNodeStatusTypes.SYNCED,
        timestamp: Date.now(),
      })
    }
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
