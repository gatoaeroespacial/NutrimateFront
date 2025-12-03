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
    // First, try to load from localStorage (cached from registration/login)
    const cachedTags = localStorage.getItem('health_tags');

    if (cachedTags) {
      try {
        const allTags: Tag[] = JSON.parse(cachedTags);
        if (this.user && this.user.tags) {
          this.userTags = allTags.filter(tag => this.user!.tags!.includes(tag.id!));
          console.log('✅ Tags cargados desde caché:', this.userTags);
          this.cdr.detectChanges();
          return; // Exit early if we have cached tags
        }
      } catch (e) {
        console.error('Error parsing cached tags:', e);
      }
    }

    // Fallback: Try to fetch from API (will fail with 403 for non-admin users)
    this.authService.getTags().subscribe({
      next: (allTags) => {
        if (this.user && this.user.tags) {
          this.userTags = allTags.filter(tag => this.user!.tags!.includes(tag.id!));
          console.log('✅ Tags cargados desde API:', this.userTags);
          // Cache for future use
          localStorage.setItem('health_tags', JSON.stringify(allTags));
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.warn('⚠️ No se pudieron cargar los tags desde la API (requiere permisos de admin)');
        // Final fallback: Create tag objects with just IDs
        if (this.user && this.user.tags) {
          this.userTags = this.user.tags.map(tagId => ({
            id: tagId,
            name: `Condición de salud #${tagId}`,
            description: 'Información no disponible'
          }));
          console.log('ℹ️ Usando IDs de tags como fallback:', this.userTags);
          this.cdr.detectChanges();
        }
      }
    });
  }

  logout() {
    localStorage.removeItem('user-progress');
    this.router.navigate(['/login']);
  }
}
