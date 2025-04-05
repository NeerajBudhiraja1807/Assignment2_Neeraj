import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../shared/graphql/mutations';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenStorageKey = 'auth_token';

  constructor(private apollo: Apollo) {}

  login(email: string, password: string) {
    console.log('📤 Sending login mutation:', {
      variables: { email, password },
      query: LOGIN_MUTATION.loc?.source.body
    });

    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
      fetchPolicy: 'no-cache',
    }).pipe(
      map((result: any) => {
        const token = result?.data?.login;
        if (token) {
          localStorage.setItem(this.tokenStorageKey, token);
          console.log('✅ Login successful. Token stored.');
          return true;
        }
        throw new Error('Invalid credentials (no token returned)');
      }),
      catchError((error) => {
        console.error('❌ Login error:', error);
        const message =
          error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          'Login failed. Check credentials.';
        return throwError(() => new Error(message));
      })
    );
  }

  signup(username: string, email: string, password: string) {
    console.log('📤 Sending signup mutation:', {
      variables: { username, email, password },
      query: SIGNUP_MUTATION.loc?.source.body
    });

    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password },
      fetchPolicy: 'no-cache',
    }).pipe(
      map((result: any) => {
        const token = result?.data?.signup;
        if (token) {
          localStorage.setItem(this.tokenStorageKey, token);
          console.log('✅ Signup successful. Token stored.');
          return true;
        }
        throw new Error('Signup failed (no token returned)');
      }),
      catchError((error) => {
        console.error('❌ Signup error:', error);
        const message =
          error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          'Signup failed.';
        return throwError(() => new Error(message));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    console.log('👋 Logged out and token removed');
  }

  getToken(): string | null {
    return typeof window !== 'undefined'
      ? localStorage.getItem(this.tokenStorageKey)
      : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
