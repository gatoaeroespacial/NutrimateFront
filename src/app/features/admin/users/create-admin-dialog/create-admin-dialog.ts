import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-create-admin-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: './create-admin-dialog.html',
    styleUrl: './create-admin-dialog.scss'
})
export class CreateAdminDialog {
    adminForm: FormGroup;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private adminService: AdminService,
        private dialogRef: MatDialogRef<CreateAdminDialog>,
        private cd: ChangeDetectorRef
    ) {
        this.adminForm = this.fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            age: [null, [Validators.required, Validators.min(1)]],
            height: [null, [Validators.required, Validators.min(1)]],
            weight: [null, [Validators.required, Validators.min(1)]]
        });
    }

    onSubmit() {
        if (this.adminForm.valid) {
            const formValue = this.adminForm.value;

            // Ensure numeric values are actually numbers
            const userData = {
                ...formValue,
                age: Number(formValue.age),
                height: Number(formValue.height),
                weight: Number(formValue.weight),
                ideal: {
                    goal: 'N',
                    ideal_weight: Number(formValue.weight) - 1
                }
            };

            console.log('Creating admin with data:', userData);

            this.adminService.createAdmin(userData).subscribe({
                next: () => {
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    console.error('Error creating admin:', err);
                    this.error = 'Error al crear administrador. Verifique los datos.';
                    this.cd.detectChanges();
                }
            });
        }
    }

    onCancel() {
        this.dialogRef.close(false);
    }
}
