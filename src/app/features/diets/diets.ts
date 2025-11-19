import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DietGeneratorService } from './services/diet-generator.service';
import { DietStateService } from './services/diet-state.service';
import { DietTable } from './diet-table/diet-table';
import { Recipe } from '../../shared/models/recipe';

interface DayMeals {
  day: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
}

@Component({
  selector: 'app-diets',
  imports: [DietTable],
  templateUrl: './diets.html',
  styleUrl: './diets.scss',
  standalone: true
})
export class Diets implements OnInit {
  loading = false;
  error: string | null = null;
  weekPlan: DayMeals[] = [];
  
  readonly daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  readonly mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

  constructor(
    private router: Router, 
    private dietGen: DietGeneratorService,
    private dietState: DietStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Restaurar el plan de la semana si existe
    this.weekPlan = this.dietState.getWeekPlan();
    this.cdr.detectChanges();
  }

  viewRecipe(recipeId: string | number) {
    this.router.navigate(['/diets/recipe', recipeId]);
  }

  generateDiet() {
    this.loading = true;
    this.error = null;
    this.weekPlan = [];
    this.cdr.detectChanges();
    
    this.dietGen.generateDiet().subscribe({
      next: (recipes) => {
        this.weekPlan = this.distributeRecipes(recipes);
        this.dietState.setWeekPlan(this.weekPlan); // Guardar en el servicio
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudo generar la dieta. Intenta de nuevo.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private distributeRecipes(recipes: Recipe[]): DayMeals[] {
    const plan: DayMeals[] = [];
    let recipeIndex = 0;

    for (let dayIndex = 0; dayIndex < this.daysOfWeek.length; dayIndex++) {
      const dayPlan: DayMeals = {
        day: this.daysOfWeek[dayIndex]
      };

      for (const mealType of this.mealTypes) {
        if (recipeIndex < recipes.length) {
          dayPlan[mealType] = recipes[recipeIndex];
          recipeIndex++;
        }
      }

      plan.push(dayPlan);
    }

    return plan;
  }
}
