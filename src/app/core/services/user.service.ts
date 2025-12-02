import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UserProfile {
    id: number;
    email: string;
    name: string;
    lastName: string;
    age?: number;
    height?: number;
    weight?: number;
    goal?: string;
    is_staff?: boolean;
    is_superuser?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private apiService: ApiService) { }

    /**
     * Get all users (admin only)
     */
    getAllUsers(): Observable<UserProfile[]> {
        return this.apiService.get<UserProfile[]>('/users/getfuckingusers/');
    }

    /**
     * Update user profile
     */
    updateProfile(userId: number, data: Partial<UserProfile>): Observable<UserProfile> {
        // Note: Backend doesn't have a dedicated update endpoint yet
        // This would need to be implemented in the backend
        return this.apiService.patch<UserProfile>(`/users/${userId}/`, data);
    }

    /**
     * Unsubscribe user by credentials
     */
    unsubscribeByCredentials(email: string, password: string): Observable<any> {
        return this.apiService.post('/users/unsubscribe-by-credentials/', { email, password });
    }
}
