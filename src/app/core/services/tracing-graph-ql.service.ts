import { Injectable } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { HttpClient } from '@angular/common/http';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { getURL } from '@shared/constants/config';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';

const SKIPPED_GRAPHQL_NAMES: string[] = [
];

@Injectable({
  providedIn: 'root',
})
export class TracingGraphQlService {

  private url: string;

  constructor(private loadingService: LoadingService,
              private http: HttpClient) { }

  changeGraphQlProvider(node: MinaNode): void {
    this.url = getURL(node['tracing-graphql'] + '/graphql');
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

    return this.http
      .post<{ data: T }>(
        this.url,
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
        }),
      );
  }
}
