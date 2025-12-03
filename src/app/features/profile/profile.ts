import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProgressService } from '../progress/services/progress.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  successMessage: string | null = null;
  passwordSuccessMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private progressService: ProgressService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      height: ['', [Validators.required, Validators.min(1)]],
      weight: ['', [Validators.required, Validators.min(1)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.progressService.getUserData().subscribe(user => {
      console.log('Profile received user data:', user);
      if (user) {
        this.profileForm.patchValue({
          name: user.nombre,
          email: user.email,
          age: user.edad,
          height: user.altura,
          weight: user.peso,
          lastName: user.apellido
        });
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmNewPassword')?.value
      ? null : { mismatch: true };
  }

  changePassword() {
    if (this.passwordForm.valid) {
      console.log('Password changed');
      this.passwordSuccessMessage = 'Contraseña actualizada correctamente';
      this.passwordForm.reset();
      setTimeout(() => this.passwordSuccessMessage = null, 3000);
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;

      // Map form values to User model
      const userData: Partial<User> = {
        nombre: formValue.name,
        email: formValue.email,
        edad: formValue.age,
        altura: formValue.height,
        peso: formValue.weight
      };

      this.progressService.updateUserProfile(userData).subscribe((success: boolean) => {
        if (success) {
          this.successMessage = 'Perfil actualizado correctamente';
          setTimeout(() => this.successMessage = null, 3000);
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('user-progress');
    this.router.navigate(['/login']);
  }
}
