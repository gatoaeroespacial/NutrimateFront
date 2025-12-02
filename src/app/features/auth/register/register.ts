import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

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
export class Register {
  registerForm: FormGroup;

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
      height: ['', [Validators.required, Validators.min(1)]], // cm

      weight: ['', [Validators.required, Validators.min(1)]], // kg
      idealWeight: ['', [Validators.required, Validators.min(1)]], // kg
      healthTags: [[], [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Map form values to backend expected format
      const formValue = this.registerForm.value;
      const userData = {
        first_name: formValue.name,
        last_name: formValue.lastName,
        email: formValue.email,
        age: formValue.age,
        height: formValue.height,
        weight: formValue.weight,
        password: formValue.password,
        ideal: {}
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.loading = false;
          this.successMessage = 'Registro exitoso. Redirigiendo al login...';

          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = error.message || 'Error al registrar usuario. Intenta nuevamente.';
          this.loading = false;
        }
      });
    }
  }
}
