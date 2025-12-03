import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminService, AdminUser } from '../services/admin.service';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './users.html',
    styleUrl: './users.scss'
})
export class AdminUsers implements OnInit {
    users: AdminUser[] = [];
    displayedColumns: string[] = ['id', 'name', 'lastName', 'weight', 'age', 'height', 'isAdmin'];

    constructor(
        private adminService: AdminService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.adminService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.cd.detectChanges();
            },
            error: (error) => {
                console.error('Error loading users:', error);
            }
        });
    }
}
