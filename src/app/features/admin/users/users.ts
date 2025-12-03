import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminService, AdminUser } from '../services/admin.service';
import { CreateAdminDialog } from './create-admin-dialog/create-admin-dialog';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule
    ],
    templateUrl: './users.html',
    styleUrl: './users.scss'
})
export class AdminUsers implements OnInit {
    users: AdminUser[] = [];
    displayedColumns: string[] = ['id', 'name', 'lastName', 'weight', 'age', 'height', 'isAdmin'];

    constructor(
        private adminService: AdminService,
        private cd: ChangeDetectorRef,
        private dialog: MatDialog
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

    openCreateAdminDialog() {
        const dialogRef = this.dialog.open(CreateAdminDialog, {
            width: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadUsers();
            }
        });
    }
}
