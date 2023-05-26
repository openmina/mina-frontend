import { Injectable, Provider } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, gql } from 'apollo-angular';
import { OperationVariables } from '@apollo/client/core/types';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { CONFIG, getURL } from '@shared/constants/config';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { LoadingService } from '@core/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {

  constructor(private apollo: Apollo,
              private httpLink: HttpLink,
              private loadingService: LoadingService) { }

  mutate<T>(mutationName: string, query: string, variables?: OperationVariables): Observable<T> {
    query = `mutation ${mutationName} ${query}`;
    this.loadingService.addURL();
    return this.apollo
      .mutate<T>({
        mutation: gql(query),
        variables,
      })
      .pipe(
        catchError((err: Error) => {
          return throwError(() => err);
        }),
        map((response) => {
          if (response.data) {
            return response.data;
          }
          throw new Error((response as any).errors[0].message);
        }),
        finalize(() => {
          this.loadingService.removeURL();
        }),
      );
  }

  changeGraphQlProvider(node: MinaNode): void {
    const link = this.httpLink.create({ uri: getURL(node.graphql + '/graphql') });
    const client = this.apollo.client;
    client.cache.reset();
    client.setLink(link);
  }
}

export const GRAPH_QL_PROVIDER: Provider = {
  provide: APOLLO_OPTIONS,
  useFactory: (httpLink: HttpLink) => {
    const link = httpLink.create({
      uri: CONFIG.configs[0].graphql + '/graphql',
    });

    const defaultOptions: DefaultOptions = {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    };

    return {
      link,
      defaultOptions,
      cache: new InMemoryCache(),
    };
  },
  deps: [HttpLink],
};
