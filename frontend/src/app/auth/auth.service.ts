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
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
      fetchPolicy: 'no-cache',
    }).pipe(
      map((result: any) => {
        const token = result?.data?.login;
        if (token) {
          localStorage.setItem(this.tokenStorageKey, token);
          return true;
        }
        throw new Error('Invalid credentials');
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed. Check credentials.'));
      })
    );
  }

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password },
      fetchPolicy: 'no-cache',
    }).pipe(
      map((result: any) => {
        const token = result?.data?.signup;
        if (token) {
          localStorage.setItem(this.tokenStorageKey, token);
          return true;
        }
        throw new Error('Signup failed');
      }),
      catchError((error) => {
        console.error('Signup error:', error);
        return throwError(() => new Error('Signup failed.'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
  }

  getToken(): string | null {
    return typeof window !== 'undefined'
      ? localStorage.getItem(this.tokenStorageKey)
      : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
