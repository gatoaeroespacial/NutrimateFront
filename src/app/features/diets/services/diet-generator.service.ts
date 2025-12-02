// src/app/features/diets/services/diet-generator.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Recipe } from '../../../shared/models/recipe';
import { DietService } from './diet.service';

@Injectable({ providedIn: 'root' })
export class DietGeneratorService {
  constructor(
    private http: HttpClient,
    private dietService: DietService
  ) { }

  generateDiet(): Observable<Recipe[]> {
    return this.dietService.getAllRecipes().pipe(
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