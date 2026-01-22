import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

type LoginResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<string> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/api/login`, { email, password })
      .pipe(
        tap((res) => this.setToken(res.token)),
        map((res) => res.token),
      );
  }
}
