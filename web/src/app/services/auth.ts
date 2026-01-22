import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

type LoginResponse = {
  token: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'auth_token';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<string> {
    return this.http.post<LoginResponse>('/api/login', { email, password }).pipe(
      tap((res) => this.setToken(res.token)),
      map((res) => res.token),
    );
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
