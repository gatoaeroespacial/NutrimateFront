import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Diets } from './features/diets/diets';
import { RecipeDetail } from './features/diets/recipe-detail/recipe-detail';
import { Progress } from './features/progress/progress';
import { History } from './features/history/history';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: '/diets', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'diets', component: Diets },
  { path: 'diets/recipe/:id', component: RecipeDetail },
  { path: 'progress', component: Progress },
  { path: 'history', component: History },
  { path: 'profile', component: Profile },
  { path: '**', redirectTo: '/diets' }
];
