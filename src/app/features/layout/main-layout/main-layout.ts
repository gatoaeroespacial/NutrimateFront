import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
    selector: 'app-main-layout',
    imports: [RouterOutlet, Navbar],
    template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
    standalone: true
})
export class MainLayout { }
