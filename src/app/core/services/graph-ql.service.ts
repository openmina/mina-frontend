import { Injectable, Provider } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { ApolloQueryResult, DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { OperationVariables } from '@apollo/client/core/types';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {

  constructor(private apollo: Apollo) { }

  query<T>(queryName: string, query: string, variables?: OperationVariables): Observable<T> {
    query = `query ${queryName} ${query}`;
    return this.apollo
      .watchQuery<T>({
        query: gql(query),
        variables,
      })
      .valueChanges
      .pipe(
        map((response: ApolloQueryResult<T>) => response.data),
      );
  }

  subscription(): Observable<any> {
    return this.apollo.subscribe({
      query: gql(`
        subscription {
          newBlock {
            stateHash
            protocolState {
              consensusState {
                blockHeight
              }
              previousStateHash
            }
          }
        }
      `),
      errorPolicy: 'ignore',
      variables: {},
      fetchPolicy: 'no-cache',
    });
  }
}


export const GRAPH_QL_PROVIDER: Provider = {
  provide: APOLLO_OPTIONS,
  useFactory: (httpLink: HttpLink) => {

    const link = httpLink.create({
      uri: environment.backend + '/graphql',
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

    // const ws = new GraphQLWsLink(
    //   createClient({
    //     url: `ws://localhost:3085/graphql`,
    //     connectionParams: {}
    //   }),
    // );
    // using the ability to split links, you can send data to each link
    // depending on what kind of operation is being sent
    // const link = split(
    //   ({ query }) => {
    //     const call = getMainDefinition(query);
    //     console.log('GraphQL call > ', call);
    //     return (call.kind === 'OperationDefinition' && call.operation === 'subscription');
    //   },
    //   // ws,
    //   http,
    // );

    return {
      link,
      defaultOptions,
      cache: new InMemoryCache(),
    };
  },
  deps: [HttpLink],
};

