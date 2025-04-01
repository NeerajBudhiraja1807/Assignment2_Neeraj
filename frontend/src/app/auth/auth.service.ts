import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../shared/graphql/mutations';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenStorageKey = 'auth_token';

  constructor(
    private apollo: Apollo,  // Use the Apollo service injected via Angular's DI system
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  // Login method with token handling and Apollo configuration
  login(email: string, password: string) {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
      fetchPolicy: 'no-cache',
    }).pipe(
      tap((result: any) => {
        if (result?.data?.login) {
          this.setToken(result.data.login); // Store the new token
        } else {
          console.error('Login mutation did not return a token');
          throw new Error('Authentication failed');
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => this.getUserFriendlyError(error)); // Handle errors
      })
    );
  }

  // Signup method with token handling and Apollo configuration
  signup(username: string, email: string, password: string) {
    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password },
      fetchPolicy: 'no-cache',
    }).pipe(
      tap((result: any) => {
        if (result?.data?.signup) {
          this.setToken(result.data.signup); // Store the new token
        }
      }),
      catchError(error => {
        console.error('Signup error:', error);
        return throwError(() => this.getUserFriendlyError(error)); // Handle errors
      })
    );
  }

  // Check if the user is authenticated by verifying the token
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (token) {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.logout(); // Log out the user if the token is expired
        return false;
      }
      return true;
    }
    return false;
  }

  // Log out the user and clear the token
  logout(): void {
    localStorage.removeItem(this.tokenStorageKey); // Clear the stored token
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Get the stored token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  // Set the token to localStorage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  // Provide a user-friendly error message
  private getUserFriendlyError(error: any): Error {
    if (error.graphQLErrors?.length) {
      const messages = error.graphQLErrors.map((e: any) => e.message);
      return new Error(messages.join(', '));
    }

    if (error.networkError) {
      return new Error('Network error. Please check your connection.');
    }

    return new Error('An unexpected error occurred. Please try again.');
  }
}
