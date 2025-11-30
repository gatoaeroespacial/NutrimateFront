import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DietHistory, Recipe } from '../../../shared/models/diet-history';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {

    constructor() { }

    getDietHistory(): Observable<DietHistory[]> {
        const mockHistory: DietHistory[] = [
            {
                startDate: '2023-10-01',
                endDate: '2023-10-07',
                menus: this.generateWeekMenu('Dieta Balanceada - Semana 1')
            },
            {
                startDate: '2023-10-08',
                endDate: '2023-10-14',
                menus: this.generateWeekMenu('Dieta Alta en Proteínas - Semana 2')
            },
            {
                startDate: '2023-10-15',
                endDate: '2023-10-21',
                menus: this.generateWeekMenu('Dieta Mediterránea - Semana 3')
            }
        ];
        return of(mockHistory);
    }

    private generateWeekMenu(baseName: string): any[] {
        const week = [];
        for (let i = 1; i <= 7; i++) {
            week.push({
                day: i,
                recipes: [
                    this.createMockRecipe(`${baseName} - Desayuno Día ${i}`),
                    this.createMockRecipe(`${baseName} - Almuerzo Día ${i}`),
                    this.createMockRecipe(`${baseName} - Cena Día ${i}`)
                ]
            });
        }
        return week;
    }

    private createMockRecipe(name: string): Recipe {
        return {
            name: name,
            description: 'Una deliciosa y nutritiva opción para tu dieta.',
            ingredients: [
                'Ingrediente 1',
                'Ingrediente 2',
                'Ingrediente 3',
                'Ingrediente 4'
            ],
            preparation_steps: 'Mezclar todos los ingredientes y cocinar a fuego lento durante 20 minutos. Servir caliente.'
        };
    }
}
