import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../../../shared/models/recipe';

@Component({
    selector: 'app-recipe-detail-modal',
    imports: [CommonModule],
    templateUrl: './recipe-detail-modal.html',
    styleUrl: './recipe-detail-modal.scss',
    standalone: true
})
export class RecipeDetailModal {
    @Input() recipe!: Recipe;
    @Output() close = new EventEmitter<void>();

    get ingredientsList(): string[] {
        return this.recipe.ingredients || [];
    }

    get preparationSteps(): string[] {
        if (!this.recipe.preparation) return [];
        // Split by newlines or periods if it's a single block, simple heuristic
        return this.recipe.preparation.split('\n').filter(step => step.trim().length > 0);
    }
}
