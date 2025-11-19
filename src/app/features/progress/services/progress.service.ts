import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User, ProgressEntry } from '../../../shared/models/user';

export interface BMICalculationRequest {
  peso: number;
  altura: number;
}

export interface BMICalculationResponse {
  bmi: number;
  category: string;
  status: 'success' | 'error';
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
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos del usuario desde el mock o localStorage
   */
  getUserData(): Observable<User> {
    // Primero intentar cargar desde localStorage
    const savedData = localStorage.getItem('user-progress');
    if (savedData) {
      try {
        const user = JSON.parse(savedData);
        this.currentUser = user;
        console.log('✅ Datos cargados desde localStorage');
        return of(user);
      } catch (error) {
        console.warn('Error parseando datos de localStorage, cargando desde mock');
        localStorage.removeItem('user-progress');
      }
    }

    // Si no hay datos guardados, cargar desde el mock
    return this.http.get<User>('/mock/user-progress.json').pipe(
      map(user => {
        this.currentUser = user;
        // Guardar en localStorage para futuras cargas
        localStorage.setItem('user-progress', JSON.stringify(user));
        console.log('✅ Datos cargados desde mock y guardados en localStorage');
        return user;
      }),
      catchError((error) => {
        console.error('Error cargando datos del usuario:', error);
        throw error;
      })
    );
  }

  /**
   * Simula el cálculo de IMC desde el backend
   * En producción, esto haría una llamada real al API
   */
  calculateBMIFromBackend(data: BMICalculationRequest): Observable<BMICalculationResponse> {
    const heightInMeters = data.altura / 100;
    const bmi = data.peso / (heightInMeters * heightInMeters);
    
    let category = '';
    if (bmi < 18.5) {
      category = 'Bajo peso';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Peso normal';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Sobrepeso';
    } else {
      category = 'Obesidad';
    }

    const response: BMICalculationResponse = {
      bmi: parseFloat(bmi.toFixed(2)),
      category,
      status: 'success'
    };

    // Simular delay de red (800ms) usando timer
    return timer(800).pipe(
      switchMap(() => of(response))
    );
  }

  /**
   * Procesa el cálculo completo y compara con datos anteriores
   */
  processProgressCalculation(newWeight: number, newHeight: number): Observable<ComparisonResult> {
    if (!this.currentUser) {
      throw new Error('No hay datos del usuario cargados');
    }

    const previousWeight = this.currentUser.peso;
    const previousHeight = this.currentUser.altura;
    
    // Obtener el último registro de progreso
    const progressHistory = this.currentUser.progreso;
    const lastProgress = progressHistory[progressHistory.length - 1];
    const previousBMI = lastProgress.bmi;

    // Calcular el nuevo IMC desde el "backend"
    return this.calculateBMIFromBackend({ peso: newWeight, altura: newHeight }).pipe(
      map(response => {
        const newBMI = response.bmi;
        
        // Calcular diferencias
        const bmiDifference = parseFloat(Math.abs(newBMI - previousBMI).toFixed(2));
        const isImprovement = newBMI < previousBMI;
        
        const weightDifference = parseFloat(Math.abs(newWeight - previousWeight).toFixed(2));
        const weightImprovement = newWeight < previousWeight;

        return {
          newBMI,
          previousBMI,
          bmiDifference,
          isImprovement,
          newWeight,
          previousWeight,
          weightDifference,
          weightImprovement,
          category: response.category
        };
      })
    );
  }

  /**
   * Simula guardar la nueva medición en el backend
   * Persiste los datos en localStorage
   */
  saveMeasurement(weight: number, height: number, bmi: number, newProgressEntry: ProgressEntry): Observable<{ success: boolean }> {
    if (!this.currentUser) {
      throw new Error('No hay datos del usuario cargados');
    }

    // Actualizar peso y altura del usuario
    this.currentUser.peso = weight;
    this.currentUser.altura = height;
    
    // Agregar nueva entrada al historial de progreso
    this.currentUser.progreso.push(newProgressEntry);

    // Persistir en localStorage
    localStorage.setItem('user-progress', JSON.stringify(this.currentUser));

    // Simular guardado en backend con delay
    console.log('� Guardando en localStorage:', {
      userId: this.currentUser.id,
      newWeight: weight,
      newHeight: height,
      newBMI: bmi,
      registrationDate: newProgressEntry.registrationDate,
      totalEntries: this.currentUser.progreso.length
    });

    return timer(500).pipe(
      switchMap(() => of({ success: true }))
    );
  }

  /**
   * Resetea los datos del usuario al mock original
   * Útil para desarrollo y testing
   */
  resetToMockData(): Observable<User> {
    localStorage.removeItem('user-progress');
    console.log('🔄 Datos reseteados al mock original');
    return this.getUserData();
  }

  /**
   * Obtiene el usuario actual en memoria
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Calcula el porcentaje de avance hacia la meta
   */
  calculateProgressPercentage(currentWeight: number, initialWeight: number, goalWeight: number): number {
    const totalToLose = initialWeight - goalWeight;
    const lostSoFar = initialWeight - currentWeight;
    const percentage = (lostSoFar / totalToLose) * 100;
    return Math.min(100, Math.max(0, parseFloat(percentage.toFixed(1))));
  }

  /**
   * Obtiene la categoría del IMC
   */
  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Bajo peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidad';
  }
}
