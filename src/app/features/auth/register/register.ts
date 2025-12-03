import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { AuthService, Tag } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  healthConditions: Tag[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      height: ['', [Validators.required, Validators.min(60), Validators.max(270)]],
      weight: ['', [Validators.required, Validators.min(30), Validators.max(170)]],
      idealWeight: ['', [Validators.required, Validators.min(30), Validators.max(170)]],
      healthTags: [[], [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadTags();
  }

  loadTags() {
    this.authService.getTags().subscribe({
      next: (tags) => {
        this.healthConditions = tags;
      },
      error: (err) => {
        console.error('Error loading tags:', err);
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.registerForm.value;
      const currentWeight = parseFloat(formValue.weight);
      const idealWeight = parseFloat(formValue.idealWeight);

      if (currentWeight === idealWeight) {
        this.errorMessage = 'El peso ideal debe ser diferente del peso actual';
        this.loading = false;
        return;
      }

      let goal: string;
      if (currentWeight > idealWeight) {
        goal = 'L'; // Lose Weight
      } else {
        goal = 'G'; // Gain Weight
      }

      const userData = {
        first_name: formValue.name,
        last_name: formValue.lastName,
        email: formValue.email,
        age: parseInt(formValue.age),
        height: parseFloat(formValue.height),
        weight: currentWeight,
        password: formValue.password,
        ideal: {
          goal: goal,
          ideal_weight: idealWeight
        },
        tags: formValue.healthTags // This will be an array of IDs
      };

      console.log('📤 Enviando datos de registro:', userData);

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('✅ Registration successful:', response);
          this.loading = false;
          this.successMessage = 'Registro exitoso. Redirigiendo al login...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (error) => {
          console.error('❌ Registration error:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error body:', error.error);

          if (error.error) {
            const errors = error.error;
            let errorMsg = 'Error al registrar usuario';

            if (typeof errors === 'string') {
              errorMsg = errors;
            } else if (errors.ideal) {
              if (errors.ideal.ideal_weight) {
                errorMsg = Array.isArray(errors.ideal.ideal_weight) ? errors.ideal.ideal_weight[0] : errors.ideal.ideal_weight;
              } else if (errors.ideal.goal) {
                errorMsg = Array.isArray(errors.ideal.goal) ? errors.ideal.goal[0] : errors.ideal.goal;
              } else {
                errorMsg = JSON.stringify(errors.ideal);
              }
            } else if (errors.weight) {
              errorMsg = Array.isArray(errors.weight) ? errors.weight[0] : errors.weight;
            } else if (errors.email) {
              errorMsg = Array.isArray(errors.email) ? errors.email[0] : errors.email;
            } else if (errors.detail) {
              errorMsg = errors.detail;
            } else {
              errorMsg = JSON.stringify(errors);
            }

            this.errorMessage = errorMsg;
          } else {
            this.errorMessage = error.message || 'Error al registrar usuario. Intenta nuevamente.';
          }

          this.loading = false;
        }
      });
    }
  }
}
