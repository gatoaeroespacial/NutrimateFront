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

  setWeekPlan(plan: DayMeals[]): void {
    this.weekPlan = plan;
  }

  getWeekPlan(): DayMeals[] {
    return this.weekPlan;
  }

  hasWeekPlan(): boolean {
    return this.weekPlan.length > 0;
  }

  clearWeekPlan(): void {
    this.weekPlan = [];
  }
}
