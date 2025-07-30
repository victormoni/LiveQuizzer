import { bootstrapApplication } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpLink } from 'apollo-angular/http';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache, split } from '@apollo/client/core';

// importa o novo link:
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),

    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const http = httpLink.create({ uri: 'http://localhost:8080/graphql' });

      // cria o cliente ws moderno
      const wsLink = new GraphQLWsLink(
        createClient({ url: 'ws://localhost:8080/graphql', retryAttempts: 5 })
      );

      // separa operações de query/mutation (HTTP) de subscription (WS)
      const link = split(
        ({ query }) => {
          const def = query.definitions[0];
          return (
            def.kind === 'OperationDefinition' &&
            (def as any).operation === 'subscription'
          );
        },
        wsLink,
        http
      );

      return { link, cache: new InMemoryCache() };
    }),
  ],
}).catch((err) => console.error(err));
