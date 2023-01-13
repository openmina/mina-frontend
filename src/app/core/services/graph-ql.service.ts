import { Injectable } from '@angular/core';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { getURL } from '@shared/constants/config';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { LoadingService } from '@core/services/loading.service';
import { HttpClient } from '@angular/common/http';


const SKIPPED_GRAPHQL_NAMES: string[] = [
  'blockStatus',
  'pooledUserCommands',
  'transactionStatus',
  'getAccount',
  'getTransactions',
];

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {

  private url: string;

  constructor(private loadingService: LoadingService,
              private http: HttpClient) { }

  changeGraphQlProvider(node: MinaNode): void {
    this.url = node.backend + '/graphql';
  }

  query<T>(queryName: string, query: string, variables?: { [key: string]: any }): Observable<T> {
    query = `query ${queryName} ${query}`;
    return this.performGqlRequest(queryName, query, variables);
  }

  mutation<T>(queryName: string, query: string, variables?: { [key: string]: any }): Observable<T> {
    query = `mutation ${queryName} ${query}`;
    return this.performGqlRequest(queryName, query, variables);
  }

  private performGqlRequest<T>(queryName: string, query: string, variables: { [key: string]: any }): Observable<T> {
    const skipLoadingIndication: boolean = SKIPPED_GRAPHQL_NAMES.some(opName => opName === queryName);
    if (!skipLoadingIndication) {
      this.loadingService.addURL();
    }

    const fullUrl = getURL(this.url);
    return this.http
      .post<{ data: T }>(
        fullUrl,
        { query, variables },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .pipe(
        catchError((err: Error) => {
          return throwError(() => err);
        }),
        map((response: { data: T }) => {
          if (response.data) {
            return response.data;
          }
          throw new Error((response as any).errors[0].message);
        }),
        finalize(() => {
          if (!skipLoadingIndication) {
            this.loadingService.removeURL();
          }
        })
      );
  }
}

