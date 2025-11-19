import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../../shared/models/recipe';

interface DayMeals {
  day: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
}

@Component({
  selector: 'app-diet-table',
  templateUrl: './diet-table.html',
  styleUrl: './diet-table.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DietTable implements OnChanges {
  @Input() weekPlan: DayMeals[] = [];

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weekPlan']) {
      this.cdr.markForCheck();
    }
  }

  viewRecipe(recipeId: string | number) {
    this.router.navigate(['/diets/recipe', recipeId]);
  }
}
