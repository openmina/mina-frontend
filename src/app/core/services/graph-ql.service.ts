import { Injectable, Provider } from '@angular/core';
import { Apollo, APOLLO_NAMED_OPTIONS, ApolloBase, gql, NamedOptions } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { ApolloLink, ApolloQueryResult, createHttpLink, DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { OperationVariables } from '@apollo/client/core/types';
import { HttpLink } from 'apollo-angular/http';
import { CONFIG } from '@shared/constants/config';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { onError } from '@apollo/client/link/error';

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {

  private apollo: ApolloBase;

  constructor(private apolloProvider: Apollo) { }

  changeGraphQlProvider(name: string): void {
    this.apollo = this.apolloProvider.use(name);
  }

  query<T>(queryName: string, query: string, variables?: OperationVariables): Observable<T> {
    query = `query ${queryName} ${query}`;
    return this.apollo
      .watchQuery<T>({
        query: gql(query),
        variables,
        errorPolicy: 'all',
      })
      .valueChanges
      .pipe(
        map((response: ApolloQueryResult<T>) => {
          if (response.data) {
            return response.data;
          }
          throw new Error(response.errors[0].message);
        }),
      );
  }

  mutation<T>(queryName: string, query: string, variables?: OperationVariables): Observable<T> {
    query = `mutation ${queryName} ${query}`;
    return this.apollo
      .watchQuery<T>({
        query: gql(query),
        variables,
        errorPolicy: 'all',
      })
      .valueChanges
      .pipe(
        map((response: ApolloQueryResult<T>) => {
          if (response.data) {
            return response.data;
          }
          throw new Error(response.errors[0].message);
        }),
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

export const GRAPH_QL_PROVIDER: Provider = {
  provide: APOLLO_NAMED_OPTIONS,
  useFactory: (): NamedOptions => {
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
    return CONFIG.nodes.reduce((acc: NamedOptions, curr: MinaNode) => ({
      ...acc,
      [curr.name]: {
        link: ApolloLink.from([
          onError((): void => {}),
          createHttpLink({
            uri: curr.backend + '/graphql',
          }),
        ]),
        defaultOptions,
        cache: new InMemoryCache(),
      },
    }), {});
  },
  deps: [HttpLink],
};

