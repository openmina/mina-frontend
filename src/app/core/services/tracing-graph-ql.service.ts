import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { getURL } from '@shared/constants/config';
import { catchError, map, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class TracingGraphQlService {

  private url: string;

  constructor(private http: HttpClient) { }

  changeGraphQlProvider(node: MinaNode): void {
    this.url = getURL(node['tracing-graphql'] + '/graphql');
  }

  query<T>(queryName: string, query: string, variables?: { [key: string]: any }): Observable<T> {
    query = `query ${queryName} ${query}`;
    return this.performGqlRequest(query, variables);
  }

  mutation<T>(queryName: string, query: string, variables?: { [key: string]: any }): Observable<T> {
    query = `mutation ${queryName} ${query}`;
    return this.performGqlRequest(query, variables);
  }

  private performGqlRequest<T>(query: string, variables: { [key: string]: any }): Observable<T> {
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
      );
  }
}
