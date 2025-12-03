import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    private getHeaders(options?: { headers?: HttpHeaders | { [header: string]: string | string[] } }): HttpHeaders {
        let headers = new HttpHeaders();
        const token = localStorage.getItem('auth_token');

        if (token) {
            headers = headers.set('Authorization', `Token ${token}`);
        }

        if (options?.headers) {
            if (options.headers instanceof HttpHeaders) {
                const httpHeaders = options.headers;
                httpHeaders.keys().forEach(key => {
                    const value = httpHeaders.get(key);
                    if (value) {
                        headers = headers.set(key, value);
                    }
                });
            } else {
                Object.keys(options.headers).forEach(key => {
                    headers = headers.set(key, (options.headers as any)[key]);
                });
            }
        }
        return headers;
    }

    /**
     * GET request
     */
    get<T>(endpoint: string, options?: { headers?: HttpHeaders | { [header: string]: string | string[] }, params?: any }): Observable<T> {
        const requestOptions = {
            ...options,
            headers: this.getHeaders(options)
        };
        return this.http.get<T>(`${this.apiUrl}${endpoint}`, requestOptions);
    }

    /**
     * POST request
     */
    post<T>(endpoint: string, data: any, options?: { headers?: HttpHeaders | { [header: string]: string | string[] }, params?: any }): Observable<T> {
        const requestOptions = {
            ...options,
            headers: this.getHeaders(options)
        };
        return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, requestOptions);
    }

    /**
     * PATCH request
     */
    patch<T>(endpoint: string, data: any, options?: { headers?: HttpHeaders | { [header: string]: string | string[] }, params?: any }): Observable<T> {
        const requestOptions = {
            ...options,
            headers: this.getHeaders(options)
        };
        return this.http.patch<T>(`${this.apiUrl}${endpoint}`, data, requestOptions);
    }

    /**
     * PUT request
     */
    put<T>(endpoint: string, data: any, options?: { headers?: HttpHeaders | { [header: string]: string | string[] }, params?: any }): Observable<T> {
        const requestOptions = {
            ...options,
            headers: this.getHeaders(options)
        };
        return this.http.put<T>(`${this.apiUrl}${endpoint}`, data, requestOptions);
    }

    /**
     * DELETE request
     */
    delete<T>(endpoint: string, options?: { headers?: HttpHeaders | { [header: string]: string | string[] }, params?: any }): Observable<T> {
        const requestOptions = {
            ...options,
            headers: this.getHeaders(options)
        };
        return this.http.delete<T>(`${this.apiUrl}${endpoint}`, requestOptions);
    }

    /**
     * Handle HTTP errors
     */
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

            if (error.error && typeof error.error === 'object') {
                // Try to extract detailed error message from response
                if (error.error.detail) {
                    errorMessage = error.error.detail;
                } else if (error.error.message) {
                    errorMessage = error.error.message;
                } else {
                    // Flatten error object for display
                    const errors = Object.entries(error.error)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                    if (errors) {
                        errorMessage = errors;
                    }
                }
            }
        }

        console.error('API Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    /**
     * Get the full API URL
     */
    getApiUrl(): string {
        return this.apiUrl;
    }
}
