import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressService, ComparisonResult } from './services/progress.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-progress',
  imports: [CommonModule, FormsModule],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
  standalone: true
})
export class Progress implements OnInit {
  // Exponer Math para usar en el template
  Math = Math;

  // Tabs
  activeTab: 'current' | 'comparison' = 'current';

  // Usuario
  user: User | null = null;

  // Formulario para nueva medición
  newWeight: number | null = null;
  newHeight: number | null = null;

  // Estados
  calculating = false;
  loadingUser = false;
  saving = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Datos de la comparación
  comparisonResult: ComparisonResult | null = null;

  // Datos previos (guardados antes de calcular)
  previousWeight: number = 0;
  previousHeight: number = 0;
  previousBMI: number = 0;

  // Estadísticas
  progressPercentage: number = 0;

  constructor(
    private progressService: ProgressService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  switchTab(tab: 'current' | 'comparison') {
    this.activeTab = tab;
  }

  loadUserData() {
    this.loadingUser = true;
    this.error = null;

    this.progressService.getUserData().subscribe({
      next: (user) => {
        this.user = user;

        // Guardar datos previos
        this.previousWeight = user.peso;
        this.previousHeight = user.altura;

        // Obtener último IMC del progreso
        if (user.progreso.length > 0) {
          this.previousBMI = user.progreso[user.progreso.length - 1].bmi;
        }


        // Pre-cargar formulario con datos actuales
        this.newWeight = user.peso;
        this.newHeight = user.altura;

        // TODO: Endpoint /api/users/progress/history/ no existe aún
        // Cargar historial completo desde el backend
        // this.progressService.getProgressHistory().subscribe({
        //   next: (history) => {
        //     this.user!.progreso = history;
        //     this.calculateInitialStats();
        //     this.loadingUser = false;
        //     this.cdr.detectChanges();
        //   },
        //   error: (err) => {
        //     console.error('Error loading history:', err);
        //     // Si falla, usar solo el progreso actual
        //     this.calculateInitialStats();
        //     this.loadingUser = false;
        //     this.cdr.detectChanges();
        //   }
        // });

        // Por ahora, solo calcular stats con datos actuales
        this.calculateInitialStats();
        this.loadingUser = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los datos del usuario';
        this.loadingUser = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateInitialStats() {
    if (!this.user || this.user.progreso.length === 0) return;

    // Calcular peso inicial (del primer registro de progreso)
    // Asumimos que el primer BMI fue con el peso actual en ese momento
    const firstBMI = this.user.progreso[0].bmi;
    const heightInMeters = this.user.altura / 100;
    const initialWeight = firstBMI * (heightInMeters * heightInMeters);

    // Calcular porcentaje de avance
    this.progressPercentage = this.progressService.calculateProgressPercentage(
      this.user.peso,
      initialWeight,
      this.user.idealActual
    );
  }

  canCalculate(): boolean {
    return this.newWeight !== null &&
      this.newHeight !== null &&
      this.newWeight > 0 &&
      this.newHeight > 0;
  }

  calculateProgress() {
    if (!this.canCalculate() || !this.user) {
      this.error = 'Por favor, ingresa peso y altura válidos';
      this.cdr.detectChanges();
      return;
    }

    this.calculating = true;
    this.error = null;
    this.successMessage = null;
    this.comparisonResult = null;
    this.cdr.detectChanges(); // Forzar actualización para mostrar estado "calculando"

    console.log('🔄 Iniciando cálculo de progreso...');
    console.log('📊 Peso anterior:', this.previousWeight, 'kg');
    console.log('📊 Altura anterior:', this.previousHeight, 'cm');
    console.log('📊 IMC anterior:', this.previousBMI);
    console.log('📊 Nuevo peso:', this.newWeight, 'kg');
    console.log('📊 Nueva altura:', this.newHeight, 'cm');

    this.progressService.processProgressCalculation(this.newWeight!, this.newHeight!).subscribe({
      next: (result) => {
        console.log('✅ Resultado del cálculo:', result);

        // Usar setTimeout para asegurar que Angular procese el cambio
        setTimeout(() => {
          this.comparisonResult = result;
          this.calculating = false;
          this.cdr.detectChanges();

          // Guardar la medición
          this.saveMeasurement(result.newBMI);
        }, 0);
      },
      error: (err) => {
        console.error('❌ Error en cálculo:', err);
        setTimeout(() => {
          this.error = 'Error al calcular el progreso. Intenta de nuevo.';
          this.calculating = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  saveMeasurement(newBMI: number) {
    this.saving = true;
    this.cdr.detectChanges(); // Forzar actualización para mostrar estado "guardando"

    // Crear la nueva entrada de progreso
    const newProgressEntry = {
      bmi: newBMI,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    this.progressService.saveMeasurement(this.newWeight!, this.newHeight!).subscribe({
      next: (response) => {
        console.log('✅ Medición guardada exitosamente en localStorage');

        // Usar setTimeout para asegurar que Angular procese el cambio
        setTimeout(() => {
          this.successMessage = '¡Medición guardada exitosamente!';
          this.saving = false;

          // Actualizar datos del usuario en el componente
          if (this.user) {
            // Actualizar peso y altura actuales
            this.user.peso = this.newWeight!;
            this.user.altura = this.newHeight!;

            // Agregar nueva entrada al historial de progreso (ya se hizo en el servicio, pero actualizamos la referencia)
            this.user.progreso.push(newProgressEntry);

            // Actualizar datos previos para la próxima medición
            this.previousWeight = this.newWeight!;
            this.previousHeight = this.newHeight!;
            this.previousBMI = newBMI;

            console.log('📝 Historial actualizado:', this.user.progreso);
            console.log('📊 Nuevos datos previos - Peso:', this.previousWeight, 'Altura:', this.previousHeight, 'IMC:', this.previousBMI);

            // Recalcular estadísticas
            this.calculateInitialStats();
          }

          this.cdr.detectChanges();

          // Limpiar mensaje de éxito después de 5 segundos
          setTimeout(() => {
            this.successMessage = null;
            this.cdr.detectChanges();
          }, 5000);
        }, 0);
      },
      error: (err) => {
        console.error('❌ Error guardando medición:', err);
        setTimeout(() => {
          this.error = 'Error al guardar la medición';
          this.saving = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  getBMICategoryClass(bmi: number): string {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getWeightDifferenceText(): string {
    if (!this.comparisonResult) return '';

    const diff = this.comparisonResult.weightDifference;
    if (this.comparisonResult.weightImprovement) {
      return `Has perdido ${diff} kg`;
    } else if (diff > 0) {
      return `Has ganado ${diff} kg`;
    }
    return 'Sin cambios';
  }

  getBMIDifferenceText(): string {
    if (!this.comparisonResult) return '';

    const diff = this.comparisonResult.bmiDifference;
    if (this.comparisonResult.isImprovement) {
      return `Tu IMC ha disminuido ${diff} puntos`;
    } else if (diff > 0) {
      return `Tu IMC ha aumentado ${diff} puntos`;
    }
    return 'Tu IMC se mantiene igual';
  }

  /**
   * Obtiene el historial de progreso ordenado de más reciente a más antiguo
   * Elimina duplicados por fecha
   */
  get sortedProgress() {
    if (!this.user || !this.user.progreso) return [];

    // Eliminar duplicados por fecha (mantener solo el más reciente de cada fecha)
    const uniqueByDate = this.user.progreso.reduce((acc, current) => {
      const existingIndex = acc.findIndex(item => item.registrationDate === current.registrationDate);
      if (existingIndex === -1) {
        acc.push(current);
      } else {
        // Si hay duplicado, mantener el que tenga un BMI diferente al anterior
        // o simplemente reemplazar
        acc[existingIndex] = current;
      }
      return acc;
    }, [] as typeof this.user.progreso);

    // Ordenar de más reciente a más antiguo
    return uniqueByDate.sort((a, b) => {
      return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
    });
  }
  // Ideal Weight Comparison
  idealWeight: number | null = null;
  idealComparisonResult: {
    weightDifference: number;
    percentage: number;
    weeksToGoal: number;
    status: 'losing' | 'gaining' | 'reached';
  } | null = null;

  calculateIdealComparison() {
    if (!this.idealWeight || !this.user) return;

    const currentWeight = this.user.peso;
    const diff = currentWeight - this.idealWeight;

    // Asumimos una pérdida saludable de 0.5kg por semana
    const weeksToGoal = Math.abs(diff) / 0.5;

    // Calcular porcentaje de progreso
    // Si no tenemos peso inicial histórico, usamos el actual + diferencia como "inicial" para el cálculo
    // O mejor, usamos el peso máximo registrado en el historial si es mayor al actual
    let initialWeight = currentWeight;
    if (this.user.progreso.length > 0) {
      // Buscar el peso máximo histórico para tener una referencia de "inicio"
      // Esto es una simplificación, idealmente tendríamos un "peso inicial del plan"
      // Pero para este feature usaremos el peso actual vs ideal
    }

    this.idealComparisonResult = {
      weightDifference: Math.abs(diff),
      percentage: 0, // Se calculará en la vista o con lógica más compleja si es necesario
      weeksToGoal: Math.ceil(weeksToGoal),
      status: diff > 0 ? 'losing' : (diff < 0 ? 'gaining' : 'reached')
    };
  }
}

