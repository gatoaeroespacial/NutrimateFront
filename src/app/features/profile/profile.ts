import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ProgressService } from '../progress/services/progress.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  user: User | null = null;

  constructor(
    private progressService: ProgressService,
    private router: Router
  ) { }

  ngOnInit() {
    this.progressService.getUserData().subscribe(user => {
      console.log('Profile received user data:', user);
      this.user = user;
    });
  }

  logout() {
    localStorage.removeItem('user-progress');
    this.router.navigate(['/login']);
  }
}
