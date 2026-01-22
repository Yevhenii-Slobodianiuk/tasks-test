import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.js';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api')) return next(req);
  if (req.url === '/api/login') return next(req);

  const auth = inject(AuthService);
  const token = auth.getToken();
  if (!token) return next(req);

  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(cloned);
};
