import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService, Tag } from '../services/admin.service';

@Component({
    selector: 'app-admin-tags',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './tags.html',
    styleUrl: './tags.scss'
})
export class AdminTags implements OnInit {
    tags: Tag[] = [];
    displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
    loading = false;
    errorMessage = '';
    successMessage = '';

    // Form state
    showForm = false;
    editingTag: Tag | null = null;
    formName = '';
    formDescription = '';

    constructor(private adminService: AdminService, private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadTags();
    }

    loadTags() {
        this.loading = true;
        this.adminService.getAllTags().subscribe({
            next: (tags) => {
                console.log('Tags loaded from backend:', tags);
                this.tags = tags;
                this.loading = false;
                this.cd.detectChanges(); // Force change detection to avoid NG0100
            },
            error: (err) => {
                console.error('Error loading tags', err);
                this.errorMessage = 'Error al cargar las etiquetas';
                this.loading = false;
            }
        });
    }

    openCreateForm() {
        this.editingTag = null;
        this.formName = '';
        this.formDescription = '';
        this.showForm = true;
        this.successMessage = ''; // Clear message when opening form
        this.errorMessage = '';
    }

    openEditForm(tag: Tag) {
        this.editingTag = tag;
        this.formName = tag.name;
        this.formDescription = tag.description || '';
        this.showForm = true;
        this.successMessage = '';
        this.errorMessage = '';
    }

    closeForm() {
        this.showForm = false;
        this.editingTag = null;
    }

    saveTag() {
        this.loading = true;

        if (this.editingTag && this.editingTag.id) {
            // Edit
            const updatedTag: Tag = {
                name: this.formName,
                description: this.formDescription
            };

            this.adminService.updateTag(this.editingTag.id, updatedTag).subscribe({
                next: (tag) => {
                    // Update local list
                    const index = this.tags.findIndex(t => t.id === tag.id);
                    if (index !== -1) {
                        this.tags[index] = tag;
                        this.tags = [...this.tags]; // Refresh table
                    }
                    this.loading = false;
                    this.closeForm();
                    this.successMessage = 'Tag actualizado correctamente';
                    setTimeout(() => this.successMessage = '', 3000);
                },
                error: (err) => {
                    console.error('Error updating tag', err);
                    this.errorMessage = 'Error al actualizar la etiqueta';
                    this.loading = false;
                }
            });
        } else {
            // Create
            const newTag: Tag = {
                name: this.formName,
                description: this.formDescription
            };

            this.adminService.createTag(newTag).subscribe({
                next: (createdTag) => {
                    this.tags.push(createdTag);
                    this.tags = [...this.tags]; // Refresh table
                    this.loading = false;
                    this.closeForm();
                    this.successMessage = 'Tag creado correctamente';
                    // Auto-clear after 3 seconds
                    setTimeout(() => this.successMessage = '', 3000);
                },
                error: (err) => {
                    console.error('Error creating tag', err);
                    this.errorMessage = 'Error al crear la etiqueta';
                    this.loading = false;
                }
            });
        }
    }

    deleteTag(id: number) {
        if (confirm('¿Estás seguro de eliminar esta etiqueta?')) {
            this.loading = true;
            this.adminService.deleteTag(id).subscribe({
                next: () => {
                    this.tags = this.tags.filter(t => t.id !== id);
                    this.loading = false;
                    this.cd.detectChanges(); // Force change detection to avoid NG0100
                },
                error: (err) => {
                    console.error('Error deleting tag', err);
                    this.errorMessage = 'Error al eliminar la etiqueta';
                    this.loading = false;
                }
            });
        }
    }
}
