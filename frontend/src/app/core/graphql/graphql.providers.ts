// src/app/core/graphql/graphql.providers.ts
import { inject } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { provideApollo } from 'apollo-angular';

export const GRAPHQL_PROVIDERS = provideApollo(() => {
  // 1) Link HTTP → queries & mutations
  const http = inject(HttpLink).create({
    uri: 'http://localhost:8080/graphql',
  });

  // 2) Link WS → subscriptions
  const ws = new GraphQLWsLink(
    createClient({
      url: 'ws://localhost:8080/graphql',
      retryAttempts: 5,
    })
  );

  // 3) split por tipo de operação
  const link = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return (
        def.kind === 'OperationDefinition' &&
        (def as any).operation === 'subscription'
      );
    },
    ws,
    http
  );

  return {
    link,
    cache: new InMemoryCache(),
  } as ApolloClientOptions<any>;
});
