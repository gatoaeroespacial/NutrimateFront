import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../../../shared/models/recipe';

@Injectable({ providedIn: 'root' })
export class DietGeneratorService {
  constructor(private http: HttpClient) {}

  // Simula una llamada a API que genera una dieta
  generateDiet(): Observable<Recipe[]> {
    // Cargamos un JSON de prueba desde /public/mock
    return this.http.get<Recipe[]>('/mock/generated-diet.json');
  }
}
