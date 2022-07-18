import { Injectable, Provider } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { ApolloQueryResult, InMemoryCache } from '@apollo/client/core';
import { OperationVariables } from '@apollo/client/core/types';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {

  constructor(private apollo: Apollo) { }

  query<T>(queryName: string, query: string, variables?: OperationVariables): Observable<T> {
    query = `query ${query}`
    return this.apollo
      .watchQuery<T>({
        query: gql(query),
        variables
      })
      .valueChanges
      .pipe(
        map((response: ApolloQueryResult<T>) => response.data),
      );
  }
}


export const GRAPH_QL_PROVIDER: Provider = {
  provide: APOLLO_OPTIONS,
  useFactory: (httpLink: HttpLink) => {
    return {
      cache: new InMemoryCache(),
      link: httpLink.create({
        uri: environment.backend + '/graphql',
      }),
    };
  },
  deps: [HttpLink],
};

