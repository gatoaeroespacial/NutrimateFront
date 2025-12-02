import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../../../shared/models/recipe';
import { DietService } from './diet.service';

@Injectable({ providedIn: 'root' })
export class DietGeneratorService {
  constructor(
    private http: HttpClient,
    private dietService: DietService
  ) { }

  /**
   * Generate a diet by getting all recipes from backend
   */
  generateDiet(): Observable<Recipe[]> {
    return this.dietService.getAllRecipes();
  }

  /**
   * Get all recipes from backend
   */
  getAllRecipes(): Observable<Recipe[]> {
    return this.dietService.getAllRecipes();
  }
}
