import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../../shared/models/recipe';
import { AdminService } from '../services/admin.service';
import { RecipeForm } from './recipe-form/recipe-form';
import { RecipeDetailModal } from './recipe-detail-modal/recipe-detail-modal';

@Component({
    selector: 'app-admin-diets',
    imports: [CommonModule, FormsModule, RecipeForm, RecipeDetailModal],
    templateUrl: './admin-diets.html',
    styleUrl: './admin-diets.scss',
    standalone: true
})
export class AdminDiets implements OnInit {
    recipes: Recipe[] = [];
    filteredRecipes: Recipe[] = [];
    searchTerm: string = '';
    loading = false;
    errorMessage = '';

    // Modal state
    showModal = false;
    selectedRecipe: Recipe | null = null;

    // Detail Modal state
    viewingRecipe: Recipe | null = null;

    constructor(
        private adminService: AdminService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadRecipes();
    }

    loadRecipes() {
        this.loading = true;
        this.errorMessage = '';

        this.adminService.getAllRecipes().subscribe({
            next: (recipes: Recipe[]) => {
                this.recipes = recipes;
                this.filterRecipes();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading recipes', err);
                this.errorMessage = 'Error al cargar las recetas. Intenta nuevamente.';
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

    openEditModal(recipe: Recipe, event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        this.selectedRecipe = { ...recipe }; // Clone to avoid direct mutation
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.selectedRecipe = null;
    }

    openViewModal(recipe: Recipe) {
        this.viewingRecipe = recipe;
    }

    closeViewModal() {
        this.viewingRecipe = null;
    }

    handleSave(recipe: Recipe) {
        if (this.selectedRecipe && this.selectedRecipe.id) {
            // Edit mode - Backend doesn't support update yet
            // For now, just update local list
            const index = this.recipes.findIndex(r => r.id === recipe.id);
            if (index !== -1) {
                this.recipes[index] = recipe;
            }
            this.filterRecipes();
            this.closeModal();
        } else {
            // Create mode - Call backend
            this.loading = true;
            this.errorMessage = '';

            // Convert Recipe to RecipeCreateRequest format
            const recipeData: any = {
                name: recipe.name,
                description: recipe.preparation || '',
                short_description: recipe.short_description,
                ingredients: recipe.ingredients || [],
                preparation_steps: recipe.preparation || '',
                nutritional_info: recipe.nutrition || {},
                meal: 'L', // Default to Lunch
                goal: 'N', // Default to Normal
                tag: [] // Tags would need to be mapped from recipe.tags
            };

            this.adminService.createRecipe(recipeData).subscribe({
                next: (createdRecipe) => {
                    console.log('Recipe created:', createdRecipe);
                    this.recipes.push(createdRecipe);
                    this.filterRecipes();
                    this.loading = false;
                    this.closeModal();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Error creating recipe:', err);
                    this.errorMessage = 'Error al crear la receta. Intenta nuevamente.';
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });
        }
    }

    deleteRecipe(id: number, event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
            this.loading = true;
            this.errorMessage = '';

            this.adminService.deleteRecipe(id).subscribe({
                next: () => {
                    console.log('Recipe deleted:', id);
                    this.recipes = this.recipes.filter(r => r.id !== id);
                    this.filterRecipes();
                    this.loading = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Error deleting recipe:', err);
                    this.errorMessage = 'Error al eliminar la receta. Intenta nuevamente.';
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });
        }
    }
}
