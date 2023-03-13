import { Injectable } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';
import { HttpClient } from '@angular/common/http';
import { catchError, concatAll, defaultIfEmpty, EMPTY, from, map, Observable, of, switchMap, take } from 'rxjs';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { CONFIG } from '@shared/constants/config';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  constructor(private graphQL: GraphQLService,
              private http: HttpClient) { }

  getActiveNode(): Observable<MinaNode> {
    const nodeName = new URL(location.href).searchParams.get('node');
    const configs = [...CONFIG.configs];
    const nodeFromURL = configs.find(c => c.name === nodeName) || configs[0];
    const nodeNameWasFound = configs.some(c => c.name === nodeName);

    configs.splice(configs.indexOf(nodeFromURL), 1);
    configs.unshift(nodeFromURL);

    let onlineNode: MinaNode = nodeFromURL;

    return from(
      configs.map(node =>
        this.http
          .post(node.backend + '/graphql', { query: latestBlockHeight }, { headers: { 'Content-Type': 'application/json' } })
          .pipe(
            map(() => node),
            switchMap(() => {
              if (nodeNameWasFound) {
                return of(node);
              } else {
                onlineNode = node;
                return this.getDebuggerStatus(node);
              }
            }),
            catchError(() => EMPTY),
          ),
      ),
    ).pipe(
      concatAll(),
      defaultIfEmpty(null),
      take(1),
      map(() => onlineNode),
    );
  }

  private getDebuggerStatus(node: MinaNode): Observable<MinaNode> {
    return this.http.get<string>(`${node.debugger}/version`).pipe(map(() => node));
  }
}

const latestBlockHeight = `
  query latestBlockHeight {
    bestChain(maxLength: 1) {
      protocolState {
        consensusState {
          blockchainLength
        }
      }
    }
  }
`;
