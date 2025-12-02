import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        lastName: string;
        is_staff?: boolean;
        is_superuser?: boolean;
    };
}

export interface RegisterRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    age: number;
    height: number;
    weight: number;
    ideal?: any;
    goal?: string;
}

export interface RegisterResponse {
    id: number;
    email: string;
    name: string;
    lastName: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';

    private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private router: Router
    ) { }

    /**
     * Login user
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.apiService.post<LoginResponse>('/users/login/', credentials)
            .pipe(
                tap(response => {
                    this.setToken(response.token);
                    this.setUser(response.user);
                    this.currentUserSubject.next(response.user);
                })
            );
    }

    /**
     * Register new user
     */
    register(userData: RegisterRequest): Observable<RegisterResponse> {
        return this.apiService.post<RegisterResponse>('/users/register/', userData);
    }

    /**
     * Logout user
     */
    logout(): Observable<any> {
        const token = this.getToken();
        if (!token) {
            this.clearAuthData();
            this.router.navigate(['/login']);
            return new Observable(observer => observer.complete());
        }

        return this.apiService.post('/users/logout/', {})
            .pipe(
                tap(() => {
                    this.clearAuthData();
                    this.router.navigate(['/login']);
                })
            );
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Check if user is admin
     */
    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.is_staff || user?.is_superuser || false;
    }

    /**
     * Get current user
     */
    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    /**
     * Get auth token
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Set auth token
     */
    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Set user data
     */
    private setUser(user: any): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    /**
     * Get user from storage
     */
    private getUserFromStorage(): any {
        const userJson = localStorage.getItem(this.USER_KEY);
        if (userJson) {
            try {
                return JSON.parse(userJson);
            } catch (e) {
                console.error('Error parsing user data:', e);
                return null;
            }
        }
        return null;
    }

    /**
     * Clear authentication data
     */
    private clearAuthData(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
    }
}
