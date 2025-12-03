import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { ProgressService } from '../progress/services/progress.service';
import { AuthService, Tag } from '../../core/services/auth.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  user: User | null = null;
  userTags: Tag[] = [];

  constructor(
    private progressService: ProgressService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.progressService.getUserData().subscribe(user => {
      this.user = user;
      if (this.user && this.user.tags && this.user.tags.length > 0) {
        this.loadUserTags();
      }
    });
  }

  loadUserTags() {
    this.authService.getTags().subscribe({
      next: (allTags) => {
        if (this.user && this.user.tags) {
          this.userTags = allTags.filter(tag => this.user!.tags!.includes(tag.id!));
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error loading tags:', err)
    });
  }

  logout() {
    localStorage.removeItem('user-progress');
    this.router.navigate(['/login']);
  }
}
