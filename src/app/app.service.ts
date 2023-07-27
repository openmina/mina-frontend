import { Injectable } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';
import { HttpClient } from '@angular/common/http';
import { catchError, concatAll, defaultIfEmpty, EMPTY, from, map, Observable, of, shareReplay, switchMap, take } from 'rxjs';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { CONFIG } from '@shared/constants/config';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  private readonly nodesHttpResponse$: Observable<any> = this.http.get<MinaNode[]>(`${CONFIG.nodeLister?.domain}:${CONFIG.nodeLister?.port}/nodes`).pipe(
    shareReplay(),
  );

  constructor(private graphQL: GraphQLService,
              private http: HttpClient) { }

  getActiveNode(nodes: MinaNode[]): Observable<MinaNode | null> {
    if (CONFIG.nodeLister) {
      return of(nodes[0]);
    }
    const nodeName = new URL(location.href).searchParams.get('node');
    const configs = nodes;
    const nodeFromURL = configs.find(c => c.name === nodeName) || configs[0];
    const nodeNameWasFound = configs.some(c => c.name === nodeName);

    configs.splice(configs.indexOf(nodeFromURL), 1);
    configs.unshift(nodeFromURL);

    let onlineNode: MinaNode = nodeFromURL;

    if (configs[0].graphql.includes('mocked')) {
      return of(configs[0]);
    }

    return from(
      configs.map(node =>
        this.http
          .post(node.graphql + '/graphql', { query: latestBlockHeight }, { headers: { 'Content-Type': 'application/json' } })
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

  getNodes(): Observable<MinaNode[]> {
    if (CONFIG.nodeLister) {
      return this.getNodesHttp().pipe(
        map((response: any[]) => {
          return response.map((node: any) => ({
            name: node.ip,
            graphql: CONFIG.nodeLister.domain + ':' + node.graphql_port + '/' + node.ip,
            'tracing-graphql': CONFIG.nodeLister.domain + ':' + node.internal_trace_port,
          }));
        }),
      );
    }
    return of(CONFIG.configs);
  }

  /* this method is called from 2 places at pretty much the same time. We will not trigger 2 requests, but only 1 and share the response */
  getNodesHttp(): Observable<any[]> {
    return this.nodesHttpResponse$;
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
