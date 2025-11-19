import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../../../shared/models/recipe';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
  standalone: true
})
export class RecipeDetail implements OnInit {
  recipe: Recipe | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    
    if (recipeId) {
      this.recipeService.getRecipeById(Number(recipeId)).subscribe({
        next: (recipe) => {
          this.recipe = recipe;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error cargando receta:', error);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  goBack() {
    this.router.navigate(['/diets']);
  }

  getNutritionValue(value: number | null | undefined): string {
    return value !== null && value !== undefined ? value.toFixed(2) : '-';
  }
}
