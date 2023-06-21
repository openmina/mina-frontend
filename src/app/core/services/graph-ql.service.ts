import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { getURL } from '@shared/constants/config';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class GraphQLService {

  private url: string;

  constructor(private http: HttpClient) { }

  changeGraphQlProvider(node: MinaNode): void {
    this.url = getURL(node.graphql + '/graphql');
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
          try {
            (response as any).errors[0].message;
          } catch (e) {
            throw new Error(response as any);
          }
          throw new Error((response as any).errors[0].message);
        }),
      );
  }
}

