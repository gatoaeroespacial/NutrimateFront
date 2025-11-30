import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../../../shared/models/recipe';

@Component({
    selector: 'app-recipe-form',
    imports: [CommonModule, FormsModule],
    templateUrl: './recipe-form.html',
    styleUrl: './recipe-form.scss',
    standalone: true
})
export class RecipeForm implements OnChanges {
    @Input() recipe: Recipe | null = null;
    @Output() save = new EventEmitter<Recipe>();
    @Output() cancel = new EventEmitter<void>();

    formData: Partial<Recipe> = this.getEmptyRecipe();

    // Helper for textareas
    ingredientsText: string = '';

    ngOnChanges(changes: SimpleChanges) {
        if (changes['recipe'] && this.recipe) {
            this.formData = JSON.parse(JSON.stringify(this.recipe));
            this.ingredientsText = this.formData.ingredients?.join('\n') || '';
        } else {
            this.formData = this.getEmptyRecipe();
            this.ingredientsText = '';
        }
    }

    getEmptyRecipe(): Partial<Recipe> {
        return {
            name: '',
            short_description: '',
            image: '',
            ingredients: [],
            preparation: '',
            nutrition: {
                per_serving: {
                    calories_kcal: 0,
                    protein_g: 0,
                    carbs_g: 0,
                    fat_g: 0
                }
            }
        };
    }

    onSubmit() {
        // Process ingredients
        this.formData.ingredients = this.ingredientsText.split('\n').filter(line => line.trim() !== '');

        this.save.emit(this.formData as Recipe);
    }
}
