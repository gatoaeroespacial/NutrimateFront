import { Injectable } from '@angular/core';
import { Recipe } from '../../../shared/models/recipe';

interface DayMeals {
  day: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
}

@Injectable({ providedIn: 'root' })
export class DietStateService {
  private weekPlan: DayMeals[] = [];
  private recipes: Recipe[] = [];

  setWeekPlan(plan: DayMeals[]): void {
    this.weekPlan = plan;
    // Extract all recipes from the plan
    this.recipes = [];
    plan.forEach(day => {
      if (day.breakfast) this.recipes.push(day.breakfast);
      if (day.lunch) this.recipes.push(day.lunch);
      if (day.dinner) this.recipes.push(day.dinner);
    });
  }

  getWeekPlan(): DayMeals[] {
    return this.weekPlan;
  }

  hasWeekPlan(): boolean {
    return this.weekPlan.length > 0;
  }

  clearWeekPlan(): void {
    this.weekPlan = [];
    this.recipes = [];
  }

  getRecipeById(id: number): Recipe | null {
    return this.recipes.find(r => r.id === id) || null;
  }

  getAllRecipes(): Recipe[] {
    return this.recipes;
  }
}
