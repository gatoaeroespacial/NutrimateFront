import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Recipe } from '../../../shared/models/recipe';

export interface Tag {
    id?: number;
    name: string;
    description?: string;
}

export interface DietCreateRequest {
    recipes: number[]; // Array of recipe IDs
}

export interface DietResponse {
    id: number;
    user: number;
    startDate: string;
    endDate: string;
    recipes: number[];
}

@Injectable({ providedIn: 'root' })
export class DietService {
    constructor(private apiService: ApiService) { }

    /**
     * Create a new diet
     */
    createDiet(recipeIds: number[]): Observable<DietResponse> {
        const data: DietCreateRequest = { recipes: recipeIds };
        return this.apiService.post<DietResponse>('/diets/diets/', data);
    }

    /**
     * Delete a diet
     */
    deleteDiet(dietId: number): Observable<void> {
        return this.apiService.delete<void>(`/diets/diets/${dietId}/`);
    }

    /**
     * Get all recipes
     */
    getAllRecipes(): Observable<Recipe[]> {
        return this.apiService.get<Recipe[]>('/diets/recipes/');
    }

    /**
     * Get all tags
     */
    getAllTags(): Observable<Tag[]> {
        return this.apiService.get<Tag[]>('/diets/tags/');
    }
}
