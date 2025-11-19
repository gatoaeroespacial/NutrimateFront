export interface ProgressEntry {
  bmi: number;
  registrationDate: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  peso: number;
  altura: number;
  enfermedades: string[];
  idealActual: number;
  progreso: ProgressEntry[];
}
