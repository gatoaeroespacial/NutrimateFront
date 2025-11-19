import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs';
import { Recipe } from '../../../shared/models/recipe';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private http: HttpClient) {}

  getRecipeById(id: number): Observable<Recipe | null> {
    return this.http.get<Recipe[]>('/assets/Recipes.json').pipe(
      map(recipes => recipes.find(r => r.id === id) || null),
      catchError((error) => {
        console.error('Error cargando Recipes.json:', error);
        return of(null);
      })
    );
  }
}
