import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Recipe } from '../../../shared/models/recipe';

export interface Tag {
    id?: number;
    name: string;
    description?: string;
}

export interface RecipeCreateRequest {
    name: string;
    description: string;
    short_description: string;
    ingredients: string[];
    preparation_steps: string;
    nutritional_info: any;
    meal: 'B' | 'L' | 'D'; // Breakfast, Lunch, Dinner
    goal: 'N' | 'W' | 'L'; // Normal, Weight gain, Weight loss
    tag: number[]; // Array of tag IDs
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    constructor(private apiService: ApiService) { }

    // ============ Recipe Management ============

    /**
     * Get all recipes
     */
    getAllRecipes(): Observable<Recipe[]> {
        return this.apiService.get<Recipe[]>('/diets/recipes/');
    }

    /**
     * Create a new recipe
     */
    createRecipe(recipe: RecipeCreateRequest): Observable<Recipe> {
        return this.apiService.post<Recipe>('/diets/recipes/', recipe);
    }

    /**
     * Create multiple recipes
     */
    createRecipes(recipes: RecipeCreateRequest[]): Observable<Recipe[]> {
        return this.apiService.post<Recipe[]>('/diets/recipes/', recipes);
    }

    /**
     * Delete a recipe
     */
    deleteRecipe(recipeId: number): Observable<void> {
        return this.apiService.delete<void>(`/diets/recipes/${recipeId}/`);
    }

    // ============ Tag Management ============

    /**
     * Get all tags
     */
    getAllTags(): Observable<Tag[]> {
        return this.apiService.get<Tag[]>('/diets/tags/');
    }

    /**
     * Create a new tag
     */
    createTag(tag: Tag): Observable<Tag> {
        return this.apiService.post<Tag>('/diets/tags/', tag);
    }

    /**
     * Create multiple tags
     */
    createTags(tags: Tag[]): Observable<Tag[]> {
        return this.apiService.post<Tag[]>('/diets/tags/', tags);
    }

    /**
     * Delete a tag
     */
    deleteTag(tagId: number): Observable<void> {
        return this.apiService.delete<void>(`/diets/tags/${tagId}/`);
    }

    // ============ Notification Management ============

    /**
     * Send bulk email notification
     * @param template - Template name (e.g., 'reminder')
     */
    sendEmailNotification(template?: string): Observable<{ detail: string; count: number }> {
        let endpoint = '/notifications/email-notification/';
        if (template) {
            endpoint += `?template=${template}`;
        }
        return this.apiService.post<{ detail: string; count: number }>(endpoint, {});
    }
}
