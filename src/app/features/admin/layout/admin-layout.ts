import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavbar } from '../../../shared/components/admin-navbar/admin-navbar';

@Component({
    selector: 'app-admin-layout',
    imports: [RouterOutlet, AdminNavbar],
    template: `
    <app-admin-navbar></app-admin-navbar>
    <router-outlet></router-outlet>
  `,
    standalone: true
})
export class AdminLayout { }
