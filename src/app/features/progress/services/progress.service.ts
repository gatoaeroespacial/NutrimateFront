// src/app/features/progress/services/progress.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User, ProgressEntry } from '../../../shared/models/user';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

export interface ProgressCreateRequest {
  current_weight: number;
  current_height: number;
}

export interface ProgressCreateResponse {
  id: number;
  user: number;
  current_weight: number;
  current_height: number;
  bmi: number;
  category: string;
  registration_date: string;
}

export interface ComparisonResult {
  newBMI: number;
  previousBMI: number;
  bmiDifference: number;
  isImprovement: boolean;
  newWeight: number;
  previousWeight: number;
  weightDifference: number;
  weightImprovement: boolean;
  category: string;
  percentage: number;
  achievedGoal: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  getUserData(): Observable<User> {
    // Get user from AuthService instead of API call
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return throwError(() => new Error('No user logged in'));
    }

    // Map the user data from AuthService to our User model
    const user: User = {
      id: currentUser.id,
      nombre: currentUser.name || '',
      apellido: currentUser.lastName || '',
      email: currentUser.email,
      edad: 0, // These will be loaded from progress endpoint if needed
      peso: 0,
      altura: 0,
      enfermedades: [],
      idealActual: 0,
      progreso: []
    };

    return of(user);
  }

  updateUserProfile(userData: Partial<User>): Observable<boolean> {
    const apiData: any = {};
    if (userData.nombre) {
      const nameParts = userData.nombre.split(' ');
      apiData.first_name = nameParts[0];
      if (nameParts.length > 1) apiData.last_name = nameParts.slice(1).join(' ');
    }
    if (userData.email) apiData.email = userData.email;
    if (userData.edad) apiData.age = userData.edad;
    if (userData.altura) apiData.height = userData.altura;
    if (userData.peso) apiData.weight = userData.peso;

    return this.apiService.patch('/users/me/', apiData).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  createProgress(weight: number, height: number): Observable<ProgressCreateResponse> {
    const data: ProgressCreateRequest = {
      current_weight: weight,
      current_height: height
    };
    return this.apiService.post<ProgressCreateResponse>('/users/progress/', data);
  }

  updateProgress(weight: number, height: number): Observable<ProgressCreateResponse> {
    const data: ProgressCreateRequest = {
      current_weight: weight,
      current_height: height
    };
    return this.apiService.patch<ProgressCreateResponse>('/users/progress/patch/', data);
  }

  getProgressHistory(): Observable<ProgressEntry[]> {
    return this.apiService.get<any[]>('/users/progress/history/').pipe(
      map(history => history.map(entry => ({
        bmi: entry.bmi,
        registrationDate: entry.recorded_at
      })))
    );
  }

  processProgressCalculation(newWeight: number, newHeight: number): Observable<ComparisonResult> {
    return this.getUserData().pipe(
      switchMap(user => {
        const hasProgress = user.progreso && user.progreso.length > 0;
        const previousWeight = user.peso;
        const previousHeight = user.altura;
        const previousBMI = hasProgress ? user.progreso[user.progreso.length - 1].bmi : this.calculateBMI(previousWeight, previousHeight);

        const progressObservable = hasProgress
          ? this.updateProgress(newWeight, newHeight)
          : this.createProgress(newWeight, newHeight);

        return progressObservable.pipe(
          map(progressResponse => {
            const weightDiff = Math.abs(newWeight - previousWeight);
            const bmiDiff = Math.abs(progressResponse.bmi - previousBMI);
            const weightImprovement = user.idealActual ?
              (user.idealActual < previousWeight ? newWeight < previousWeight : newWeight > previousWeight) :
              false;
            const bmiImprovement = progressResponse.bmi < previousBMI;

            return {
              newBMI: progressResponse.bmi,
              previousBMI: previousBMI,
              bmiDifference: parseFloat(bmiDiff.toFixed(2)),
              isImprovement: bmiImprovement,
              newWeight: newWeight,
              previousWeight: previousWeight,
              weightDifference: parseFloat(weightDiff.toFixed(2)),
              weightImprovement: weightImprovement,
              category: this.getBMICategory(progressResponse.bmi),
              percentage: 0,
              achievedGoal: false
            };
          })
        );
      }),
      catchError(error => {
        console.error('❌ Error en cálculo:', error);
        return throwError(() => error);
      })
    );
  }

  saveMeasurement(weight: number, height: number): Observable<{ success: boolean, data?: ProgressCreateResponse }> {
    return of({ success: true });
  }

  calculateProgressPercentage(currentWeight: number, initialWeight: number, goalWeight: number): number {
    if (!goalWeight || goalWeight === initialWeight) return 0;
    const totalToChange = Math.abs(goalWeight - initialWeight);
    const changedSoFar = Math.abs(initialWeight - currentWeight);
    const percentage = (changedSoFar / totalToChange) * 100;
    return Math.min(100, Math.max(0, parseFloat(percentage.toFixed(1))));
  }

  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Bajo peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  calculateBMI(weight: number, height: number): number {
    if (!weight || !height || height === 0) return 0;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(2));
  }
}