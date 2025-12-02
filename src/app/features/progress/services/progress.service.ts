import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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

export interface ComparisonResponse {
  ideal_weight: number;
  current_weight: number;
  difference: number;
  percentage: number;
  achieved_goal: boolean;
  current_bmi: number;
  ideal_bmi: number;
  bmi_difference: number;
  category: string;
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

  /**
   * Get user data with progress history
   */
  getUserData(): Observable<User> {
    return this.apiService.get<any>('/users/me/').pipe(
      map(user => {
        // Map backend response to frontend User model
        const progressEntries: ProgressEntry[] = [];

        if (user.progress) {
          progressEntries.push({
            bmi: user.progress.bmi,
            registrationDate: user.progress.last_updated
          });
        }

        return {
          id: user.id,
          nombre: `${user.first_name} ${user.last_name || ''}`.trim(),
          email: user.email,
          edad: user.age,
          peso: user.weight,
          altura: user.height,
          enfermedades: [], // Not available in backend response yet
          idealActual: (user.ideal && user.ideal.ideal_weight) || 0,
          progreso: progressEntries
        };
      })
    );
  }

  /**
   * Update user profile
   */
  updateUserProfile(userData: Partial<User>): Observable<boolean> {
    const apiData: any = {};
    if (userData.nombre) apiData.first_name = userData.nombre;
    if (userData.email) apiData.email = userData.email;
    if (userData.edad) apiData.age = userData.edad;
    if (userData.altura) apiData.height = userData.altura;
    if (userData.peso) apiData.weight = userData.peso;

    return this.apiService.patch('/users/me/', apiData).pipe(
      map(() => true),
      // catchError is handled by global interceptor or subscriber, but we can return false
      map(() => true)
    );
  }

  /**
   * Create a new progress record
   */
  createProgress(weight: number, height: number): Observable<ProgressCreateResponse> {
    const data: ProgressCreateRequest = {
      current_weight: weight,
      current_height: height
    };
    return this.apiService.post<ProgressCreateResponse>('/users/progress/', data);
  }

  /**
   * Update progress record
   */
  updateProgress(weight: number, height: number): Observable<ProgressCreateResponse> {
    const data: ProgressCreateRequest = {
      current_weight: weight,
      current_height: height
    };
    return this.apiService.patch<ProgressCreateResponse>('/users/progress/patch/', data);
  }

  /**
   * Get comparison data (progress vs ideal weight)
   */
  getComparison(): Observable<ComparisonResponse> {
    return this.apiService.get<ComparisonResponse>('/users/comparison/');
  }

  /**
   * Process progress calculation and comparison
   * This combines creating/updating progress and getting comparison
   */
  processProgressCalculation(newWeight: number, newHeight: number, isUpdate: boolean = false): Observable<ComparisonResult> {
    const progressObservable = isUpdate
      ? this.updateProgress(newWeight, newHeight)
      : this.createProgress(newWeight, newHeight);

    return progressObservable.pipe(
      map(progressResponse => {
        // Get comparison data after creating/updating progress
        // Note: In a real scenario, you might want to chain this with another API call
        // For now, we'll use the data from the progress response
        return {
          newBMI: progressResponse.bmi,
          previousBMI: 0, // This would come from historical data
          bmiDifference: 0,
          isImprovement: false,
          newWeight: progressResponse.current_weight,
          previousWeight: 0,
          weightDifference: 0,
          weightImprovement: false,
          category: progressResponse.category,
          percentage: 0,
          achievedGoal: false
        };
      })
    );
  }

  /**
   * Save measurement (creates or updates progress)
   */
  saveMeasurement(weight: number, height: number, isUpdate: boolean = false): Observable<{ success: boolean, data?: ProgressCreateResponse }> {
    const progressObservable = isUpdate
      ? this.updateProgress(weight, height)
      : this.createProgress(weight, height);

    return progressObservable.pipe(
      map(response => ({ success: true, data: response }))
    );
  }

  /**
   * Calculate progress percentage towards goal
   */
  calculateProgressPercentage(currentWeight: number, initialWeight: number, goalWeight: number): number {
    const totalToLose = initialWeight - goalWeight;
    const lostSoFar = initialWeight - currentWeight;
    const percentage = (lostSoFar / totalToLose) * 100;
    return Math.min(100, Math.max(0, parseFloat(percentage.toFixed(1))));
  }

  /**
   * Get BMI category
   */
  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Bajo peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  /**
   * Calculate BMI locally
   */
  calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(2));
  }
}
