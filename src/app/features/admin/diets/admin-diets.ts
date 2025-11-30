import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../../shared/models/recipe';
import { DietGeneratorService } from '../../diets/services/diet-generator.service';
import { RecipeForm } from './recipe-form/recipe-form';

@Component({
    selector: 'app-admin-diets',
    imports: [CommonModule, FormsModule, RecipeForm],
    templateUrl: './admin-diets.html',
    styleUrl: './admin-diets.scss',
    standalone: true
})
export class AdminDiets implements OnInit {
    recipes: Recipe[] = [];
    filteredRecipes: Recipe[] = [];
    searchTerm: string = '';
    loading = false;

    // Modal state
    showModal = false;
    selectedRecipe: Recipe | null = null;

    constructor(
        private dietService: DietGeneratorService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadRecipes();
    }

    loadRecipes() {
        this.loading = true;
        this.dietService.getAllRecipes().subscribe({
            next: (recipes: Recipe[]) => {
                this.recipes = recipes;
                this.filterRecipes();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading recipes', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    filterRecipes() {
        if (!this.searchTerm) {
            this.filteredRecipes = this.recipes;
            return;
        }

        const term = this.searchTerm.toLowerCase();
        this.filteredRecipes = this.recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(term) ||
            recipe.short_description.toLowerCase().includes(term)
        );
    }

    openCreateModal() {
        this.selectedRecipe = null;
        this.showModal = true;
    }

    openEditModal(recipe: Recipe) {
        this.selectedRecipe = { ...recipe }; // Clone to avoid direct mutation
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.selectedRecipe = null;
    }

    handleSave(recipe: Recipe) {
        if (this.selectedRecipe && this.selectedRecipe.id) {
            // Edit mode
            // In a real app, call service to update. For now, update local list
            const index = this.recipes.findIndex(r => r.id === recipe.id);
            if (index !== -1) {
                this.recipes[index] = recipe;
            }
        } else {
            // Create mode
            // Generate a temporary ID
            const newId = Math.max(...this.recipes.map(r => r.id), 0) + 1;
            recipe.id = newId;
            this.recipes.push(recipe);
        }

        this.filterRecipes();
        this.closeModal();
    }

    deleteRecipe(id: number) {
        if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
            this.recipes = this.recipes.filter(r => r.id !== id);
            this.filterRecipes();
        }
    }
}
