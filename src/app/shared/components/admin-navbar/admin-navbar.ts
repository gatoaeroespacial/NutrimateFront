import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-admin-navbar',
    imports: [RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-links">
                <a routerLink="/admin/dietas" routerLinkActive="active" class="nav-link">Recetas</a>
                <a routerLink="/admin/tags" routerLinkActive="active" class="nav-link">Tags</a>
            </div>

            <div class="ghost-logo"></div>
            <div class="logo-container">
                <div class="outer-circle">
                    <div class="inner-circle">
                        <img src="img/logo.png" alt="NutriMate Logo" class="logo">
                    </div>
                </div>
            </div>

            <div class="nav-links">
                <a routerLink="/admin/users" routerLinkActive="active" class="nav-link">Usuarios</a>
                <a routerLink="/admin/profile" routerLinkActive="active" class="nav-link">Perfil</a>
            </div>
        </div>
    </nav>
  `,
    styleUrl: './admin-navbar.scss',
    standalone: true
})
export class AdminNavbar { }
