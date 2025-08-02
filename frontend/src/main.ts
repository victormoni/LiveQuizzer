// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { GRAPHQL_PROVIDERS } from './app/core/graphql/graphql.providers';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // HttpClient para REST (scores)
    provideRouter(routes, withComponentInputBinding()), // Rotas
    GRAPHQL_PROVIDERS, // Apollo + GraphQL
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
}).catch((err) => console.error(err));
