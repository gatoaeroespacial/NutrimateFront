import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ProgressService } from '../progress/services/progress.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  passwordForm: FormGroup;
  passwordSuccessMessage: string | null = null;
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private progressService: ProgressService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.progressService.getUserData().subscribe(user => {
      console.log('Profile received user data:', user);
      this.user = user;
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



  logout() {
    localStorage.removeItem('user-progress');
    this.router.navigate(['/login']);
  }
}
