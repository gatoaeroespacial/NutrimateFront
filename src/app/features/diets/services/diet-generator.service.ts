// src/app/features/diets/services/diet-generator.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Recipe } from '../../../shared/models/recipe';
import { DietService, DietResponse } from './diet.service';

@Injectable({ providedIn: 'root' })
export class DietGeneratorService {
  constructor(
    private http: HttpClient,
    private dietService: DietService
  ) { }

  generateDiet(): Observable<Recipe[]> {
    // Call the backend endpoint that creates a diet and returns selected recipes
    return this.dietService.createDiet([]).pipe(
      map((dietResponse: DietResponse) => {
        // Extract all recipes from all menus
        const allRecipes: Recipe[] = [];

        if (dietResponse.menus) {
          dietResponse.menus.forEach(menu => {
            if (menu.detailed_recipes) {
              allRecipes.push(...menu.detailed_recipes);
            }
          });
        }

        console.log('✅ Dieta creada con', allRecipes.length, 'recetas');
        return allRecipes;
      }),
      catchError(error => {
        console.error('❌ Error generando dieta:', error);
        // Retornar array vacío en caso de error
        return of([]);
      })
    );
  }

  getAllRecipes(): Observable<Recipe[]> {
    return this.dietService.getAllRecipes().pipe(
      catchError(error => {
        console.error('❌ Error obteniendo recetas:', error);
        return of([]);
      })
    );
  }
}