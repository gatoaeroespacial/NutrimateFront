import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User, ProgressEntry } from '../../../shared/models/user';
import { ApiService } from '../../../core/services/api.service';

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
    private apiService: ApiService
  ) { }

  getUserData(): Observable<User> {
    // Get user data from localStorage (stored during login)
    const userJson = localStorage.getItem('current_user');

    if (!userJson) {
      return throwError(() => new Error('No user logged in'));
    }

    try {
      const backendUser = JSON.parse(userJson);

      const progressEntries: ProgressEntry[] = [];

      // Add current progress if exists
      if (backendUser.progress) {
        progressEntries.push({
          bmi: 0, // Will be calculated or fetched
          registrationDate: new Date().toISOString()
        });
      }

      // Map the user data - support both camelCase (frontend) and snake_case (backend) properties
      const user: User = {
        id: backendUser.id,
        nombre: backendUser.name || backendUser.first_name || '',
        apellido: backendUser.lastName || backendUser.last_name || '',
        email: backendUser.email,
        edad: backendUser.age || 0,
        peso: backendUser.weight || 0,
        altura: backendUser.height || 0,
        enfermedades: [],
        tags: backendUser.tags || [],
        idealActual: backendUser.ideal?.ideal_weight || 0,
        progreso: progressEntries
      };

      console.log('✅ Datos del usuario cargados:', user);
      return of(user);
    } catch (error) {
      console.error('❌ Error parseando datos del usuario:', error);
      return throwError(() => new Error('Error loading user data'));
    }
  }

  updateUserProfile(userData: Partial<User>): Observable<boolean> {
    // Update localStorage with new data
    const userJson = localStorage.getItem('current_user');
    if (userJson) {
      try {
        const currentUser = JSON.parse(userJson);

        // Save as both formats to ensure compatibility
        if (userData.nombre) {
          currentUser.name = userData.nombre;
          currentUser.first_name = userData.nombre;
        }
        if (userData.apellido) {
          currentUser.lastName = userData.apellido;
          currentUser.last_name = userData.apellido;
        }
        if (userData.email) currentUser.email = userData.email;
        if (userData.edad) currentUser.age = userData.edad;
        if (userData.altura) currentUser.height = userData.altura;
        if (userData.peso) currentUser.weight = userData.peso;

        localStorage.setItem('current_user', JSON.stringify(currentUser));
        console.log('✅ Perfil actualizado en localStorage');

        // If weight/height are present, try to update progress in backend (best effort)
        if (userData.peso || userData.altura) {
          const weight = userData.peso || currentUser.weight || 0;
          const height = userData.altura || currentUser.height || 0;
          // We don't wait for this to complete to return success for the profile update
          this.updateProgress(weight, height).subscribe({
            next: () => console.log('✅ Progreso actualizado en backend'),
            error: (err) => console.warn('⚠️ No se pudo actualizar progreso en backend:', err)
          });
        }

        return of(true);
      } catch (error) {
        console.error('❌ Error actualizando perfil:', error);
        return of(false);
      }
    }
    return of(false);
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
    // This endpoint doesn't exist yet, return empty array
    console.warn('⚠️ Progress history endpoint not available');
    return of([]);
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
            console.log('📦 Respuesta del backend:', progressResponse);

            // Calculate BMI manually if backend doesn't return it
            const newBMI = progressResponse.bmi || this.calculateBMI(newWeight, newHeight);
            console.log('📊 Nuevo IMC:', newBMI);

            const weightDiff = Math.abs(newWeight - previousWeight);
            const bmiDiff = Math.abs(newBMI - previousBMI);
            const weightImprovement = user.idealActual ?
              (user.idealActual < previousWeight ? newWeight < previousWeight : newWeight > previousWeight) :
              false;
            const bmiImprovement = newBMI < previousBMI;

            return {
              newBMI: parseFloat(newBMI.toFixed(2)),
              previousBMI: parseFloat(previousBMI.toFixed(2)),
              bmiDifference: parseFloat(bmiDiff.toFixed(2)),
              isImprovement: bmiImprovement,
              newWeight: newWeight,
              previousWeight: previousWeight,
              weightDifference: parseFloat(weightDiff.toFixed(2)),
              weightImprovement: weightImprovement,
              category: this.getBMICategory(newBMI),
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