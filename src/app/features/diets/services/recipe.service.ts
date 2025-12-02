import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs';
import { Recipe } from '../../../shared/models/recipe';
import { DietService } from './diet.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(
    private http: HttpClient,
    private dietService: DietService
  ) { }

  /**
   * Get recipe by ID from backend
   */
  getRecipeById(id: number): Observable<Recipe | null> {
    return this.dietService.getAllRecipes().pipe(
      map(recipes => recipes.find(r => r.id === id) || null),
      catchError((error) => {
        console.error('Error loading recipes:', error);
        return of(null);
      })
    );
  }
}
