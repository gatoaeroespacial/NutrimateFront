import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface Tag {
    id: number;
    name: string;
    description: string;
}

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
export class AdminTags {
    tags: Tag[] = [
        { id: 1, name: 'Diabetes', description: 'Evitar azúcares simples, productos con azúcar añadido y carbohidratos refinados.' },
        { id: 2, name: 'Hipertensión', description: 'Reducir el consumo de sodio, alimentos procesados y grasas saturadas.' },
        { id: 3, name: 'Celiaquía', description: 'Estrictamente sin gluten (trigo, cebada, centeno).' },
        { id: 4, name: 'Intolerancia a la Lactosa', description: 'Evitar leche y derivados lácteos que contengan lactosa.' },
        { id: 5, name: 'Colesterol Alto', description: 'Limitar grasas trans, grasas saturadas y carnes rojas procesadas.' }
    ];

    displayedColumns: string[] = ['name', 'description', 'actions'];

    // Form state
    showForm = false;
    editingTag: Tag | null = null;
    formName = '';
    formDescription = '';

    openCreateForm() {
        this.editingTag = null;
        this.formName = '';
        this.formDescription = '';
        this.showForm = true;
    }

    openEditForm(tag: Tag) {
        this.editingTag = tag;
        this.formName = tag.name;
        this.formDescription = tag.description;
        this.showForm = true;
    }

    closeForm() {
        this.showForm = false;
        this.editingTag = null;
    }

    saveTag() {
        if (this.editingTag) {
            // Edit
            this.editingTag.name = this.formName;
            this.editingTag.description = this.formDescription;
        } else {
            // Create
            const newId = Math.max(...this.tags.map(t => t.id), 0) + 1;
            this.tags.push({
                id: newId,
                name: this.formName,
                description: this.formDescription
            });
            this.tags = [...this.tags]; // Refresh table
        }
        this.closeForm();
    }

    deleteTag(id: number) {
        if (confirm('¿Estás seguro de eliminar esta etiqueta?')) {
            this.tags = this.tags.filter(t => t.id !== id);
        }
    }
}
