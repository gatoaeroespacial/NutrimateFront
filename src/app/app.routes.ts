import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Diets } from './features/diets/diets';
import { RecipeDetail } from './features/diets/recipe-detail/recipe-detail';
import { Progress } from './features/progress/progress';
import { History } from './features/history/history';
import { Profile } from './features/profile/profile';
import { MainLayout } from './features/layout/main-layout/main-layout';
import { adminGuard } from './core/guards/admin.guard';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/layout/admin-layout').then(m => m.AdminLayout),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dietas', pathMatch: 'full' },
      { path: 'dietas', loadComponent: () => import('./features/admin/diets/admin-diets').then(m => m.AdminDiets) },
      { path: 'tags', loadComponent: () => import('./features/admin/tags/tags').then(m => m.AdminTags) },
      { path: 'profile', component: Profile }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./features/layout/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      { path: '', redirectTo: 'dietas', pathMatch: 'full' },
      { path: 'dietas', component: Diets },
      { path: 'diets/recipe/:id', component: RecipeDetail },
      { path: 'progress', component: Progress },
      { path: 'history', component: History },
      { path: 'news', loadComponent: () => import('./features/news/news').then(m => m.News) },
      { path: 'profile', component: Profile }
    ]
  },
  { path: '**', redirectTo: '/dietas' }
];
