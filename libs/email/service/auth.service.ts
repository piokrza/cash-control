import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Environment } from 'apps/email-client/src/environments';
import { finalize, Observable, tap, catchError, EMPTY } from 'rxjs';

import { ToastStatus } from '@ngpk/email/enum';
import {
  AvailableUsernameResponse,
  SignupCredentials,
  SignupResponse,
  CheckAuthResponse,
  SigninCredencials,
  SigninResponse,
} from '@ngpk/email/model';
import { ToastService } from '@ngpk/email/service';
import { AuthStateService } from '@ngpk/email/state/auth';

@Injectable()
export class AuthService {
  readonly #http = inject(HttpClient);
  readonly #environment = inject(Environment);
  readonly #toastService = inject(ToastService);
  readonly #authStateService = inject(AuthStateService);

  usernameAvailable$(username: string): Observable<AvailableUsernameResponse> {
    return this.#http.post<AvailableUsernameResponse>(`${this.#environment.baseUrl}/auth/username`, { username: username });
  }

  signUp$(credentials: SignupCredentials): Observable<SignupResponse> {
    this.#authStateService.update('isLoading', true);

    return this.#http.post<SignupResponse>(`${this.#environment.baseUrl}/auth/signup`, credentials).pipe(
      tap(() => this.#authStateService.update('isSignedIn', true)),
      tap(({ username }) => username && this.#authStateService.update('username', username)),
      finalize(() => this.#authStateService.update('isLoading', false))
    );
  }

  signIn$(credentials: SigninCredencials): Observable<SigninResponse> {
    this.#authStateService.update('isLoading', true);

    return this.#http.post<SigninCredencials>(`${this.#environment.baseUrl}/auth/signin`, credentials).pipe(
      tap(() => this.#authStateService.update('isSignedIn', true)),
      tap(({ username }) => this.#authStateService.update('username', username)),
      finalize(() => this.#authStateService.update('isLoading', false))
    );
  }

  signOut$(): Observable<object> {
    return this.#http.post<object>(`${this.#environment.baseUrl}/auth/signout`, {}).pipe(
      tap(() => this.#authStateService.update('username', '')),
      tap(() => this.#authStateService.update('isSignedIn', false))
    );
  }

  checkAuth$(): Observable<CheckAuthResponse> {
    return this.#http.get<CheckAuthResponse>(`${this.#environment.baseUrl}/auth/signedin`).pipe(
      tap(({ authenticated }) => this.#authStateService.update('isSignedIn', authenticated)),
      tap(({ username }) => username && this.#authStateService.update('username', username)),
      catchError((err: HttpErrorResponse): Observable<never> => {
        if (err.status === 0) {
          this.#toastService.showInfoMessage(ToastStatus.ERROR, 'Error!', 'Check internet connection');
        }
        return EMPTY;
      })
    );
  }
}
