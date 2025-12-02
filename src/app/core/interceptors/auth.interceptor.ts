import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.getToken();

    // Clone the request and add authorization header if token exists
    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Token ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error) => {
            // Handle 401 Unauthorized errors
            if (error.status === 401) {
                // Clear auth data and redirect to login
                authService.logout().subscribe();
            }
            return throwError(() => error);
        })
    );
};
