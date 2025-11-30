import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['Juan', Validators.required],
      lastName: ['Perez', Validators.required],
      email: ['juan@example.com', [Validators.required, Validators.email]],
      age: [25, [Validators.required, Validators.min(1), Validators.max(120)]],
      height: [175, [Validators.required, Validators.min(1)]], // cm
      weight: [70, [Validators.required, Validators.min(1)]] // kg
    });
  }

  saveProfile() {
    if (this.profileForm.valid) {
      console.log('Profile saved:', this.profileForm.value);
      // TODO: Implement actual save logic
    }
  }
}
