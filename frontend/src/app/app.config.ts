import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    HttpClientModule,
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        const errorLink = onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message }) =>
              console.error(`[GraphQL error]: ${message}`)
            );
          }
          if (networkError) {
            console.error(`[Network error]: ${networkError}`);
          }
        });

        const authLink = setContext((_, { headers }) => {
          const token = localStorage.getItem('auth_token');
          return {
            headers: {
              ...headers,
              Authorization: token ? `Bearer ${token}` : ''
            }
          };
        });

        const http = httpLink.create({
          uri: 'http://localhost:5001/graphql'
        });

        return {
          cache: new InMemoryCache(),
          link: errorLink.concat(authLink.concat(http)),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'network-only',
              errorPolicy: 'all'
            },
            query: {
              fetchPolicy: 'network-only',
              errorPolicy: 'all'
            },
            mutate: {
              errorPolicy: 'all'
            }
          }
        };
      },
      deps: [HttpLink],
    },
    Apollo,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ]
};
