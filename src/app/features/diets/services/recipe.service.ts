import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Recipe } from '../../../shared/models/recipe';
import { DietStateService } from './diet-state.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(
    private http: HttpClient,
    private dietStateService: DietStateService
  ) { }

  /**
   * Get recipe by ID from the diet state (already loaded recipes)
   */
  getRecipeById(id: number): Observable<Recipe | null> {
    const recipe = this.dietStateService.getRecipeById(id);
    return of(recipe);
  }

  /**
   * Get all recipes from the diet state
   */
  getAllRecipes(): Observable<Recipe[]> {
    const recipes = this.dietStateService.getAllRecipes();
    return of(recipes);
  }
}
